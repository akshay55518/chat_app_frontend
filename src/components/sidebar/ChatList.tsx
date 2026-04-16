import type { Conversation } from "../../types/api";
import { useAuth } from "../../context/AuthContext";
import ChatItem from "./ChatItem";

interface Props {
  conversations: Conversation[];
  isLoading: boolean;
  activeChat: number | null;
  onSelectChat: (id: number) => void;
}

export default function ChatList({ conversations, isLoading, activeChat, onSelectChat }: Props) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <div className="w-6 h-6 border-2 border-[#1b6b50] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs">Loading chats...</span>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-3xl mb-2">💬</div>
          <p className="text-sm font-medium text-gray-500">No conversations yet</p>
          <p className="text-xs text-gray-400 mt-1">Search for a user to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conv) => (
        <ChatItem
          key={conv.id}
          conversation={conv}
          active={conv.id === activeChat}
          onClick={() => onSelectChat(conv.id)}
        />
      ))}
    </div>
  );
}