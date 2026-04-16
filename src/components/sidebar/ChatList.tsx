import { chats } from "../../data/chats";
import ChatItem from "./ChatItem";

interface Props {
  activeChat: string;
  onSelectChat: (id: string) => void;
}

export default function ChatList({ activeChat, onSelectChat }: Props) {
  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          active={chat.id === activeChat}
          onClick={() => onSelectChat(chat.id)}
        />
      ))}
    </div>
  );
}