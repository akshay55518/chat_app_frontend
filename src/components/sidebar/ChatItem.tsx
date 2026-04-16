import { useAuth } from "../../context/AuthContext";
import type { Conversation } from "../../types/api";

interface Props {
  conversation: Conversation;
  active: boolean;
  onClick: () => void;
}

// Get a display name for a conversation from the participant list
export function getConversationName(conv: Conversation, myEmail: string | undefined): string {
  if (conv.type === "group" && conv.name) return conv.name;
  const other = conv.participants.find((p) => p.user !== myEmail);
  return other ? other.user.split("@")[0] : "Unknown";
}

export function getInitials(name: string): string {
  return name
    .split(/[\s@]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-[#c9e8dc] text-[#1b6b50]",
  "bg-blue-100 text-blue-700",
  "bg-pink-100 text-pink-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
];

function colorForId(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

export default function ChatItem({ conversation, active, onClick }: Props) {
  const { user } = useAuth();
  const name = getConversationName(conversation, user?.email);
  const initials = getInitials(name);
  const colorClass = colorForId(conversation.id);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-black/5 transition-colors ${
        active
          ? "bg-white border-l-[3px] border-l-[#1b6b50]"
          : "hover:bg-black/[0.03]"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm ${colorClass}`}>
          {initials}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">
          {conversation.type === "group" ? `${conversation.participants.length} members` : "Tap to chat"}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] text-gray-400">
          {new Date(conversation.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}
        </span>
      </div>
    </div>
  );
}