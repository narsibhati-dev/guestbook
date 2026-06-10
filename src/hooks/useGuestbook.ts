"use client";

import { useState, useCallback } from "react";
import {
  AccountRole,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
  signTransactionMessageWithSigners,
  getBase64EncodedWireTransaction,
  getSignatureFromTransaction,
  pipe,
  type TransactionSigner,
  type Instruction,
  type Signature,
} from "@solana/kit";
import { rpc } from "@/lib/rpc";
import {
  PROGRAM_ID,
  SYSTEM_PROGRAM,
  getMessagePDA,
  encodeCreateMessage,
  encodeUpdateMessage,
  encodeDeleteMessage,
  getProgramErrorMessage,
  type DecodedMessage,
} from "@/lib/program";

const CONFIRM_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 1_000;

async function waitForConfirmation(signature: Signature): Promise<void> {
  const deadline = Date.now() + CONFIRM_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const { value } = await rpc
      .getSignatureStatuses([signature], { searchTransactionHistory: false })
      .send();
    const status = value[0];
    if (status) {
      if (status.err) throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
      if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") return;
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
  }
  throw new Error("Transaction confirmation timed out");
}

async function buildSignAndSend(signer: TransactionSigner, instruction: Instruction): Promise<void> {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  const txMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (t) => setTransactionMessageFeePayerSigner(signer, t),
    (t) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, t),
    (t) => appendTransactionMessageInstruction(instruction, t)
  );
  const signedTx = await signTransactionMessageWithSigners(txMessage);
  const signature = getSignatureFromTransaction(signedTx);
  const wireEncoded = getBase64EncodedWireTransaction(signedTx);
  await rpc.sendTransaction(wireEncoded, { encoding: "base64", skipPreflight: false }).send();
  await waitForConfirmation(signature);
}

function friendlyError(e: unknown): string {
  const programError = getProgramErrorMessage(e);
  if (programError) return programError;
  if (e instanceof Error) return e.message;
  return "Transaction failed";
}

export function useGuestbook(signer: TransactionSigner | null) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (build: () => Promise<Instruction>, onSuccess?: () => void) => {
      if (!signer) return;
      setSubmitting(true);
      setError(null);
      try {
        const ix = await build();
        await buildSignAndSend(signer, ix);
        onSuccess?.();
      } catch (e) {
        setError(friendlyError(e));
      } finally {
        setSubmitting(false);
      }
    },
    [signer]
  );

  const createMessage = useCallback(
    (message: string, onSuccess?: () => void) => {
      const messageId = BigInt(Date.now());
      return run(async () => ({
        programAddress: PROGRAM_ID,
        accounts: [
          { address: signer!.address, role: AccountRole.WRITABLE_SIGNER },
          { address: await getMessagePDA(signer!.address, messageId), role: AccountRole.WRITABLE },
          { address: SYSTEM_PROGRAM, role: AccountRole.READONLY },
        ],
        data: encodeCreateMessage(messageId, message),
      }), onSuccess);
    },
    [signer, run]
  );

  const updateMessage = useCallback(
    (messageId: bigint, message: string, onSuccess?: () => void) =>
      run(async () => ({
        programAddress: PROGRAM_ID,
        accounts: [
          { address: signer!.address, role: AccountRole.WRITABLE_SIGNER },
          { address: await getMessagePDA(signer!.address, messageId), role: AccountRole.WRITABLE },
        ],
        data: encodeUpdateMessage(messageId, message),
      }), onSuccess),
    [signer, run]
  );

  const deleteMessage = useCallback(
    (messageId: bigint, onSuccess?: () => void) =>
      run(async () => ({
        programAddress: PROGRAM_ID,
        accounts: [
          { address: signer!.address, role: AccountRole.WRITABLE_SIGNER },
          { address: await getMessagePDA(signer!.address, messageId), role: AccountRole.WRITABLE },
        ],
        data: encodeDeleteMessage(messageId),
      }), onSuccess),
    [signer, run]
  );

  const getOwnMessages = useCallback(
    (messages: DecodedMessage[]): DecodedMessage[] =>
      signer ? messages.filter((m) => m.author === signer.address) : [],
    [signer]
  );

  return { createMessage, updateMessage, deleteMessage, getOwnMessages, submitting, error };
}
