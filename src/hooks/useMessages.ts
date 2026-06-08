"use client";

import { useEffect, useState, useCallback } from "react";
import type { Base64EncodedBytes } from "@solana/kit";
import { rpc } from "@/lib/rpc";
import { PROGRAM_ID, DISC, decodeMessageAccount, type DecodedMessage } from "@/lib/program";

// Base64-encode the MessageAccount discriminator for the memcmp filter
const DISC_B64 = Buffer.from(DISC.messageAccount).toString("base64") as Base64EncodedBytes;

export function useMessages() {
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const accounts = await rpc
        .getProgramAccounts(PROGRAM_ID, {
          encoding: "base64",
          filters: [
            {
              memcmp: {
                offset: 0n,
                bytes: DISC_B64,
                encoding: "base64",
              },
            },
          ],
        })
        .send();

      const decoded = accounts
        .map((acc) => {
          const [b64] = acc.account.data as [string, string];
          const bytes = Uint8Array.from(Buffer.from(b64, "base64"));
          return decodeMessageAccount(acc.pubkey, bytes);
        })
        .filter((m): m is DecodedMessage => m !== null);

      setMessages(decoded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, loading, error, refetch: fetchMessages };
}
