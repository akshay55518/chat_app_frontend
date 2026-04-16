import type { Message } from "../../data/messages";

interface Props {
  msg: Message;
}

export default function MessageBubble({ msg }: Props) {
  const isMe = msg.is_sender;

  return (
    <div className={`flex gap-2 items-end w-full ${isMe ? "flex-row-reverse" : ""}`}>
      {!isMe && (
        <div className="w-7 h-7 rounded-full bg-[#c9e8dc] flex items-center justify-center text-[11px] font-semibold text-[#1b6b50] flex-shrink-0 mt-auto">
          JM
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
          {msg.text}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[11px] text-gray-400">{msg.time}</span>
          {isMe && msg.read && (
            <svg className="w-3.5 h-3.5 text-[#1b6b50]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.41 13.41L6 19l1.41-1.42L1.83 12zm20.71-9.42L11 14.17l-4.12-4.13L5.46 11.5l5.54 5.54 12-12zM18 7l-1.41-1.42-6.35 6.35.71.71z"/>
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}