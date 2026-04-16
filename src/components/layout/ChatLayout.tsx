import { useState } from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "../chats/ChatWindow";
import ProfileDrawer from "../profile/ProfileDrawer";

export default function ChatLayout() {
  const [activeChat, setActiveChat] = useState("1");
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMeProfile, setIsMeProfile] = useState(false);

  const openMyProfile = () => {
    setIsMeProfile(true);
    setProfileOpen(true);
  };

  const openOtherProfile = () => {
    setIsMeProfile(false);
    setProfileOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#eef2f0] overflow-hidden">
      <Sidebar 
        activeChat={activeChat} 
        onSelectChat={setActiveChat} 
        onOpenMyProfile={openMyProfile}
      />
      <ChatWindow
        activeChatId={activeChat}
        onOpenProfile={openOtherProfile}
      />
      {profileOpen && (
        <ProfileDrawer
          activeChatId={activeChat}
          isMe={isMeProfile}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}