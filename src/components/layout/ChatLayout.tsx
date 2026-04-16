import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import type { Conversation } from "../../types/api";
import Sidebar from "./Sidebar";
import ChatWindow from "../chats/ChatWindow";
import ProfileDrawer from "../profile/ProfileDrawer";
import NewChatModal from "../modals/NewChatModal";

export default function ChatLayout() {
  const { token } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isMeProfile, setIsMeProfile] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const activeConversation = conversations.find((c) => c.id === activeConvId) ?? null;

  useEffect(() => {
    if (!token) return;
    fetchConversations();
  }, [token]);

  const fetchConversations = async () => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch(API_ENDPOINTS.CONVERSATIONS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: Conversation[] = await res.json();
        setConversations(data);
        // Auto-select first conversation if none is selected
        if (data.length > 0) {
          setActiveConvId((prev) => prev ?? data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations", err);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const handleSelectConversation = async (id: number) => {
    // If it's a new conversation not yet in our list, fetch and prepend it
    if (!conversations.find((c) => c.id === id)) {
      try {
        const res = await fetch(API_ENDPOINTS.CONVERSATION(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const newConv: Conversation = await res.json();
          setConversations((prev) =>
            prev.find((c) => c.id === newConv.id) ? prev : [newConv, ...prev]
          );
        }
      } catch (err) {
        console.error("Failed to fetch new conversation", err);
      }
    }
    setActiveConvId(id);
    setProfileOpen(false);
    setIsNewChatModalOpen(false);
  };

  const handleCreateConversation = async (userId: number) => {
    setIsCreatingChat(true);
    try {
      const res = await fetch(API_ENDPOINTS.CREATE_CONVERSATION, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "dm", user_ids: [userId] }),
      });
      if (res.ok) {
        const conv = await res.json();
        handleSelectConversation(conv.id);
      }
    } catch (err) {
      console.error("Failed to create conversation", err);
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#eef2f0] overflow-hidden">
        <Sidebar
          conversations={conversations}
          isLoadingConversations={isLoadingConversations}
          activeChat={activeConvId}
          onSelectConversation={handleSelectConversation}
          onSelectUser={handleCreateConversation}
          onOpenMyProfile={() => { setIsMeProfile(true); setProfileOpen(true); }}
          onNewChat={() => setIsNewChatModalOpen(true)}
          isCreatingChat={isCreatingChat}
        />

        <ChatWindow
          conversation={activeConversation}
          onOpenProfile={() => { setIsMeProfile(false); setProfileOpen(true); }}
        />

        {profileOpen && (
          <ProfileDrawer
            conversation={activeConversation}
            isMe={isMeProfile}
            onClose={() => setProfileOpen(false)}
          />
        )}
      </div>

      {isNewChatModalOpen && (
        <NewChatModal
          onClose={() => setIsNewChatModalOpen(false)}
          onSelectUser={handleCreateConversation}
          isCreating={isCreatingChat}
        />
      )}
    </>
  );
}