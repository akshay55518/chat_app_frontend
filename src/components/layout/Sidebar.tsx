import type { Conversation } from "../../types/api";
import ChatList from "../sidebar/ChatList";
import SearchBar from "../sidebar/SearchBar";
import UserProfile from "../sidebar/UserProfile";

interface Props {
  conversations: Conversation[];
  isLoadingConversations: boolean;
  activeChat: number | null;
  onSelectConversation: (id: number) => void;
  onSelectUser: (id: number) => void;
  onOpenMyProfile: () => void;
  onNewChat: () => void;
  isCreatingChat?: boolean;
}

export default function Sidebar({
  conversations,
  isLoadingConversations,
  activeChat,
  onSelectConversation,
  onSelectUser,
  onOpenMyProfile,
  onNewChat,
  isCreatingChat,
}: Props) {
  return (
    <div className="w-[320px] min-w-[320px] bg-[#eef2f0] flex flex-col border-r border-gray-200">
      <UserProfile onOpen={onOpenMyProfile} />

      <SearchBar onSelectUser={onSelectUser} isCreating={isCreatingChat} />

      {/* Tabs */}
      <div className="flex px-3 gap-1 border-b border-gray-200">
        {["Chats", "Contacts", "Calls"].map((tab, i) => (
          <button
            key={tab}
            className={`px-3 py-2 text-sm pb-2 border-b-2 -mb-px transition-colors ${
              i === 0
                ? "text-[#1b6b50] border-[#1b6b50] font-medium"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <ChatList
        conversations={conversations}
        isLoading={isLoadingConversations}
        activeChat={activeChat}
        onSelectChat={onSelectConversation}
      />

      {/* New Message button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full bg-[#1b6b50] text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#155840] transition-colors"
        >
          <span className="text-lg leading-none">+</span> New Message
        </button>
      </div>
    </div>
  );
}