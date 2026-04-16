import type { Chat } from "../../data/chats";

interface Props {
  chat: Chat;
  active: boolean;
  onClick: () => void;
}

const avatarColors: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  pink: "bg-pink-100 text-pink-700",
};

export default function ChatItem({ chat, active, onClick }: Props) {
  const colorClass =
    chat.avatarColor && avatarColors[chat.avatarColor]
      ? avatarColors[chat.avatarColor]
      : "bg-[#c9e8dc] text-[#1b6b50]";

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
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm ${colorClass}`}
        >
          {chat.initials}
        </div>
        {chat.online && (
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#eef2f0]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{chat.name}</p>
        <p className="text-xs text-gray-500 truncate mt-0.5">{chat.lastMessage}</p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-[11px] text-gray-400">{chat.time}</span>
        {chat.unread ? (
          <span className="bg-[#1b6b50] text-white text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none">
            {chat.unread}
          </span>
        ) : null}
      </div>
    </div>
  );
}