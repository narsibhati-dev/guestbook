"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { Base64EncodedBytes } from "@solana/kit";
import { address } from "@solana/kit";
import { rpc } from "@/lib/rpc";
import { PROGRAM_ID, DISC, decodeMessageAccount, type DecodedMessage } from "@/lib/program";

const DISC_B64 = Buffer.from(DISC.messageAccount).toString("base64") as Base64EncodedBytes;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchBlockTime(accountAddress: string): Promise<number | null> {
  try {
    const sigs = await rpc
      .getSignaturesForAddress(address(accountAddress), { limit: 1, commitment: "confirmed" })
      .send();

    const sig = sigs[0];
    if (!sig) return null;

    if (sig.blockTime !== null) return Number(sig.blockTime) * 1000;

    // blockTime is null on devnet — fall back to getBlockTime(slot)
    try {
      const slotTime = await rpc.getBlockTime(sig.slot).send();
      if (slotTime !== null) return Number(slotTime) * 1000;
    } catch {
      // slot too old or unavailable
    }
  } catch {
    // RPC error
  }
  return null;
}

export function useMessages() {
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const genRef = useRef(0);

  const fetchMessages = useCallback(async () => {
    const gen = ++genRef.current;
    setLoading(true);
    setError(null);

    try {
      const accounts = await rpc
        .getProgramAccounts(PROGRAM_ID, {
          encoding: "base64",
          filters: [{ memcmp: { offset: 0n, bytes: DISC_B64, encoding: "base64" } }],
        })
        .send();

      const decoded = accounts
        .map((acc) => {
          const [b64] = acc.account.data as [string, string];
          const bytes = Uint8Array.from(Buffer.from(b64, "base64"));
          return decodeMessageAccount(acc.pubkey, bytes);
        })
        .filter((m): m is DecodedMessage => m !== null);

      // Show messages immediately — don't wait for timestamps
      if (gen !== genRef.current) return;
      setMessages(decoded);
      setLoading(false);

      // Fetch timestamps in the background, 3 at a time to avoid rate limits
      const results = [...decoded];
      const BATCH = 3;
      for (let i = 0; i < decoded.length; i += BATCH) {
        if (gen !== genRef.current) return;
        const batch = decoded.slice(i, i + BATCH);
        const times = await Promise.all(batch.map((m) => fetchBlockTime(m.accountAddress)));
        times.forEach((ts, j) => { results[i + j] = { ...results[i + j], timestamp: ts }; });
        if (i + BATCH < decoded.length) await sleep(150);
      }

      if (gen !== genRef.current) return;
      const sorted = [...results].sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0));
      setMessages(sorted);
    } catch (e) {
      if (gen !== genRef.current) return;
      setError(e instanceof Error ? e.message : "Failed to fetch messages");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
}
