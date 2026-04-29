import type { ApiMessage } from "../../types/api";
import { useAuth } from "../../context/AuthContext";

interface Props {
  msg: ApiMessage;
  senderInitials?: string;
}

export default function MessageBubble({ msg, senderInitials }: Props) {
  const { user } = useAuth();
  const isMe = msg.sender === user?.email;

  const time = new Date(msg.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex gap-2 items-end w-full ${isMe ? "flex-row-reverse" : ""}`}>
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-[#c9e8dc] flex items-center justify-center text-[11px] font-semibold text-[#1b6b50] flex-shrink-0 mt-auto">
          {senderInitials || msg.sender[0].toUpperCase()}
        </div>
      )}
      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[75%]`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words w-fit ${
            isMe
              ? "bg-[#1b6b50] text-white rounded-2xl rounded-br-sm"
              : "bg-[#eeeeee] text-gray-900 rounded-2xl rounded-bl-sm"
          }`}
        >
          {msg.type === "image" && (msg.image_url || msg.media_url) ? (
            <img
              src={msg.image_url || msg.media_url || ""}
              alt="Shared"
              className="max-w-64 rounded-lg"
            />
          ) : (
            msg.content
          )}
        </div>
        <span className="text-[11px] text-gray-400 mt-1">{time}</span>
      </div>
    </div>
  );
}
