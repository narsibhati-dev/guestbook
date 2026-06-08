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

/** Derive the PDA for a given authority: seeds = ["message", authority] */
export async function getMessagePDA(authority: Address): Promise<Address> {
  const [pda] = await getProgramDerivedAddress({
    programAddress: PROGRAM_ID,
    seeds: [
      new TextEncoder().encode("message"),
      getAddressEncoder().encode(authority),
    ],
  });
  return pda;
}

// ── Instruction data encoding (Anchor / Borsh) ────────────────────────────

function encodeStr(str: string): Uint8Array {
  const utf8 = new TextEncoder().encode(str);
  const out = new Uint8Array(4 + utf8.length);
  new DataView(out.buffer).setUint32(0, utf8.length, true); // u32 LE
  out.set(utf8, 4);
  return out;
}

export function encodeCreateMessage(message: string): Uint8Array {
  const str = encodeStr(message);
  const out = new Uint8Array(8 + str.length);
  out.set(DISC.createMessage, 0);
  out.set(str, 8);
  return out;
}

export function encodeUpdateMessage(message: string): Uint8Array {
  const str = encodeStr(message);
  const out = new Uint8Array(8 + str.length);
  out.set(DISC.updateMessage, 0);
  out.set(str, 8);
  return out;
}

export function encodeDeleteMessage(): Uint8Array {
  return new Uint8Array(DISC.deleteMessage);
}

// ── Account decoding ──────────────────────────────────────────────────────

export interface DecodedMessage {
  /** On-chain account address */
  accountAddress: string;
  /** Author wallet address */
  author: string;
  /** Message content */
  message: string;
  /** PDA bump */
  bump: number;
}

export function decodeMessageAccount(
  accountAddress: string,
  data: Uint8Array
): DecodedMessage | null {
  try {
    let offset = 8; // skip 8-byte Anchor discriminator
    const authorBytes = data.slice(offset, offset + 32);
    offset += 32;
    const msgLen = new DataView(
      data.buffer,
      data.byteOffset + offset,
      4
    ).getUint32(0, true);
    offset += 4;
    const msgBytes = data.slice(offset, offset + msgLen);
    offset += msgLen;
    const bump = data[offset]; // u8
    const author = getAddressDecoder().decode(authorBytes);
    const message = new TextDecoder().decode(msgBytes);
    return { accountAddress, author, message, bump };
  } catch {
    return null;
  }
}

// ── IDL errors ────────────────────────────────────────────────────────────

export const PROGRAM_ERRORS: Record<number, string> = {
  6000: "You can only edit or delete your own message.",
  6001: "Message is too long.",
};

/**
 * Best-effort extraction of an Anchor custom-program-error code from a
 * Solana RPC error / log line and mapping it to a friendly message.
 */
export function getProgramErrorMessage(error: unknown): string | null {
  const text =
    error instanceof Error ? `${error.message} ${error.stack ?? ""}` : String(error);
  // Anchor errors surface as "custom program error: 0x1770" (= 6000), etc.
  const hexMatch = text.match(/custom program error[:\s]+0x([0-9a-fA-F]+)/);
  if (hexMatch) {
    const code = parseInt(hexMatch[1], 16);
    if (PROGRAM_ERRORS[code]) return PROGRAM_ERRORS[code];
  }
  // Also try the JSON-RPC `InstructionError` shape: [..., { Custom: 6000 }]
  const customMatch = text.match(/"Custom"\s*:\s*(\d+)/);
  if (customMatch) {
    const code = parseInt(customMatch[1], 10);
    if (PROGRAM_ERRORS[code]) return PROGRAM_ERRORS[code];
  }
  return null;
}
