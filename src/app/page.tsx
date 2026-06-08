import WalletButton from "@/components/WalletButton";
import MessageForm from "@/components/MessageForm";
import MessageCard, { type Message } from "@/components/MessageCard";

const DUMMY_MESSAGES: Message[] = [
  {
    id: 1,
    address: "FpFT..cmLX",
    initials: "F",
    avatarColor: "#4a6fa5",
    message: "Hola amigo kaise ho theek ho",
    isOwn: false,
  },
  {
    id: 2,
    address: "2HKk..3RHW",
    initials: "2",
    avatarColor: "#6b4f8a",
    message: "garden me jo tomato hai wo kharab ku ho rhe ...",
    isOwn: false,
  },
  {
    id: 3,
    address: "Eoyz..DpFX",
    initials: "E",
    avatarColor: "#3d7a6e",
    message: "kam kar raha hai kya",
    isOwn: true,
  },
  {
    id: 4,
    address: "GPmH..UArx",
    initials: "G",
    avatarColor: "#9a6b3e",
    message: "hi ... from new account",
    isOwn: false,
  },
  {
    id: 5,
    address: "A84J..nkvF",
    initials: "A",
    avatarColor: "#3e7a5e",
    message: "narsi is gareeb",
    isOwn: false,
  },
];

const CURRENT_MESSAGE = "kam kar raha hai kya";

export default function Home() {
  return (
    <main className="min-h-screen bg-page px-6 py-12 pb-20">
      <div className="max-w-[1100px] mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-[42px] font-bold text-primary tracking-tight leading-none">
            Guestbook
          </h1>
          <p className="mt-2 text-sm text-secondary">
            Leave a message on Solana devnet
          </p>
        </div>

        {/* Wallet */}
        <WalletButton />

        {/* Form */}
        <MessageForm currentMessage={CURRENT_MESSAGE} />

        {/* Messages */}
        <div className="w-full">
          <div className="flex items-center gap-2.5 mb-5">
            <h2 className="text-lg font-semibold text-primary">Messages</h2>
            <span className="bg-card border border-line rounded-[6px] text-xs font-medium text-secondary px-2 py-px">
              {DUMMY_MESSAGES.length}
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {DUMMY_MESSAGES.map((msg) => (
              <MessageCard key={msg.id} msg={msg} />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
