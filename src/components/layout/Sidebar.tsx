import ChatList from "../sidebar/ChatList";
import SearchBar from "../sidebar/SearchBar";
import UserProfile from "../sidebar/UserProfile";


interface Props {
  activeChat: string;
  onSelectChat: (id: string) => void;
  onOpenMyProfile: () => void;
}

export default function Sidebar({ activeChat, onSelectChat, onOpenMyProfile }: Props) {
  return (
    <div className="w-[320px] min-w-[320px] bg-[#eef2f0] flex flex-col border-r border-gray-200">
      <UserProfile onOpen={onOpenMyProfile} />

      <SearchBar />

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

      <ChatList activeChat={activeChat} onSelectChat={onSelectChat} />

      {/* New Message */}
      <div className="p-3">
        <button className="w-full bg-[#1b6b50] text-white rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2">
          <span className="text-lg leading-none">+</span> New Message
        </button>
      </div>
    </div>
  );
}