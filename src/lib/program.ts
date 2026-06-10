import {
  address,
  getProgramDerivedAddress,
  getAddressEncoder,
  getAddressDecoder,
  type Address,
} from "@solana/kit";

export const PROGRAM_ID = address(
  "DtPyeMVaKZCMvyexKPGvEGEHb4h4zUtjnCo1HsFaTF6o"
);
export const SYSTEM_PROGRAM = address("11111111111111111111111111111111");
export const CHAIN = "solana:devnet" as const;

export const DISC = {
  createMessage:  new Uint8Array([234, 159,   7, 241, 215,  17, 188, 237]),
  updateMessage:  new Uint8Array([ 23, 135,  34, 211,  96, 120, 107,   9]),
  deleteMessage:  new Uint8Array([198,  99,  22, 204, 200, 165,  54, 138]),
  messageAccount: new Uint8Array([ 97, 144,  24,  58, 225,  40,  89, 223]),
};

/** Derive the PDA: seeds = ["message", authority, message_id (u64 LE)] */
export async function getMessagePDA(authority: Address, messageId: bigint): Promise<Address> {
  const idBytes = new Uint8Array(8);
  new DataView(idBytes.buffer).setBigUint64(0, messageId, true);
  const [pda] = await getProgramDerivedAddress({
    programAddress: PROGRAM_ID,
    seeds: [
      new TextEncoder().encode("message"),
      getAddressEncoder().encode(authority),
      idBytes,
    ],
  });
  return pda;
}

// ── Borsh helpers ─────────────────────────────────────────────────────────

function encodeStr(str: string): Uint8Array {
  const utf8 = new TextEncoder().encode(str);
  const out = new Uint8Array(4 + utf8.length);
  new DataView(out.buffer).setUint32(0, utf8.length, true);
  out.set(utf8, 4);
  return out;
}

function encodeU64(n: bigint): Uint8Array {
  const buf = new Uint8Array(8);
  new DataView(buf.buffer).setBigUint64(0, n, true);
  return buf;
}

// ── Instruction encoding ──────────────────────────────────────────────────

export function encodeCreateMessage(messageId: bigint, message: string): Uint8Array {
  const id  = encodeU64(messageId);
  const str = encodeStr(message);
  const out = new Uint8Array(8 + 8 + str.length);
  out.set(DISC.createMessage, 0);
  out.set(id, 8);
  out.set(str, 16);
  return out;
}

export function encodeUpdateMessage(messageId: bigint, message: string): Uint8Array {
  const id  = encodeU64(messageId);
  const str = encodeStr(message);
  const out = new Uint8Array(8 + 8 + str.length);
  out.set(DISC.updateMessage, 0);
  out.set(id, 8);
  out.set(str, 16);
  return out;
}

export function encodeDeleteMessage(messageId: bigint): Uint8Array {
  const out = new Uint8Array(8 + 8);
  out.set(DISC.deleteMessage, 0);
  new DataView(out.buffer).setBigUint64(8, messageId, true);
  return out;
}

// ── Account decoding ──────────────────────────────────────────────────────

export interface DecodedMessage {
  accountAddress: string;
  author: string;
  id: bigint;
  message: string;
  bump: number;
  timestamp: number | null;
}

/**
 * Layout (Anchor / Borsh):
 *   [0..8]   discriminator
 *   [8..40]  author (pubkey, 32 bytes)
 *   [40..48] id (u64 LE)
 *   [48..52] message length (u32 LE)
 *   [52..]   message (utf-8)
 *   [last]   bump (u8)
 */
export function decodeMessageAccount(
  accountAddress: string,
  data: Uint8Array
): DecodedMessage | null {
  try {
    let offset = 8;
    const authorBytes = data.slice(offset, offset + 32); offset += 32;
    const id = new DataView(data.buffer, data.byteOffset + offset, 8).getBigUint64(0, true); offset += 8;
    const msgLen = new DataView(data.buffer, data.byteOffset + offset, 4).getUint32(0, true); offset += 4;
    const msgBytes = data.slice(offset, offset + msgLen); offset += msgLen;
    const bump = data[offset];
    const author = getAddressDecoder().decode(authorBytes);
    const message = new TextDecoder().decode(msgBytes);
    return { accountAddress, author, id, message, bump, timestamp: null };
  } catch {
    return null;
  }
}

// ── IDL errors ────────────────────────────────────────────────────────────

export const PROGRAM_ERRORS: Record<number, string> = {
  6000: "You can only edit or delete your own message.",
  6001: "Message is too long.",
};

export function getProgramErrorMessage(error: unknown): string | null {
  const text =
    error instanceof Error ? `${error.message} ${error.stack ?? ""}` : String(error);
  const hexMatch = text.match(/custom program error[:\s]+0x([0-9a-fA-F]+)/);
  if (hexMatch) {
    const code = parseInt(hexMatch[1], 16);
    if (PROGRAM_ERRORS[code]) return PROGRAM_ERRORS[code];
  }
  const customMatch = text.match(/"Custom"\s*:\s*(\d+)/);
  if (customMatch) {
    const code = parseInt(customMatch[1], 10);
    if (PROGRAM_ERRORS[code]) return PROGRAM_ERRORS[code];
  }
  return null;
}
