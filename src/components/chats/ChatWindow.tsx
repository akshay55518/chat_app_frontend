import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import type { ApiMessage, Conversation } from "../../types/api";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Props {
  conversation: Conversation | null;
  onOpenProfile: () => void;
}

export default function ChatWindow({ conversation, onOpenProfile }: Props) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wallpapers, setWallpapers] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem("chatWallpapers");
      return stored ? JSON.parse(stored) : {};
    } catch { return {}; }
  });
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const wallpaper = conversation ? (wallpapers[conversation.id] || "") : "";

  // Fetch message history when conversation changes
  useEffect(() => {
    if (!conversation || !token) return;
    setMessages([]);
    fetchMessages(conversation.id);
    connectWebSocket(conversation.id);

    return () => {
      wsRef.current?.close();
    };
  }, [conversation?.id, token]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async (convId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(API_ENDPOINTS.MESSAGES(convId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: ApiMessage[] = await res.json();
        // API returns newest first, so reverse for display
        setMessages(data.reverse());
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWebSocket = (convId: number) => {
    if (!token) return;
    wsRef.current?.close();
    const ws = new WebSocket(API_ENDPOINTS.WS_CHAT(convId, token));

    ws.onopen = () => {
      console.log("[WS OPEN] Requesting initial status");
      ws.send(JSON.stringify({ type: "ping" }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[WS RECEIVED]", data);

        if (data.type === "user_status") {
          setOnlineUsers((prev) => {
            const next = new Set(prev);
            if (data.status === "online") next.add(data.user);
            else next.delete(data.user);
            return next;
          });
          return;
        }

        const newMsg: ApiMessage = {
          id: data.message_id || Date.now(),
          conversation: convId,
          sender: data.user,
          type: "text",
          content: data.message,
          media_url: null,
          created_at: data.created_at || new Date().toISOString(),
        };
        // Update messages state
        setMessages((prev) => {
          // Prevent duplicates if the message ID already exists
          if (prev.some(m => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onerror = (err) => console.error("WebSocket error", err);
    wsRef.current = ws;
  };

  const handleSend = async (text: string) => {
    if (!conversation || !token) return;

    console.log("[UI SENDING]", text);

    // Broadcast via WebSocket for real-time and persistence
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message: text }));
    } else {
      console.error("[WS ERROR] Socket not open");
      // Optional: Add local error feedback here
    }
  };

  const updateWallpaper = (url: string) => {
    if (!conversation) return;
    const updated = { ...wallpapers };
    if (url) updated[conversation.id] = url;
    else delete updated[conversation.id];
    setWallpapers(updated);
    try {
      localStorage.setItem("chatWallpapers", JSON.stringify(updated));
    } catch (e) {
      alert("Image too large to save.");
    }
  };

  const handleClearChat = () => {
    if (confirm("Clear this chat locally?")) setMessages([]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) { updateWallpaper(reader.result as string); setShowWallpaperModal(false); }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f7faf8]">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Welcome to the Chat</h2>
          <p className="text-sm text-gray-400">Select a conversation or search for a user to get started</p>
        </div>
      </div>
    );
  }

  // Calculate if the other participant is online
  const otherParticipant = conversation?.participants.find(p => p.user !== user?.email);
  const isOnline = otherParticipant ? onlineUsers.has(otherParticipant.user) : false;

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      <ChatHeader
        conversation={conversation}
        isOnline={isOnline}
        onOpenProfile={onOpenProfile}
        onSetWallpaper={() => setShowWallpaperModal(true)}
        onClearChat={handleClearChat}
      />

      <div
        className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 ${!wallpaper ? "bg-[#f7faf8]" : "bg-cover bg-center"}`}
        style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : undefined}
      >
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#1b6b50] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400">No messages yet. Say hello! 👋</p>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} />

      {/* Wallpaper Modal */}
      {showWallpaperModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-80 p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Set Background</h3>
              <button onClick={() => setShowWallpaperModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-xl">×</button>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Preset Wallpapers</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { updateWallpaper(""); setShowWallpaperModal(false); }} className="h-16 bg-[#f7faf8] rounded-xl border border-gray-200 text-xs text-gray-400 hover:border-[#1b6b50]">Default</button>
                {[
                  "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80",
                  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80",
                ].map((url) => (
                  <button key={url} onClick={() => { updateWallpaper(url); setShowWallpaperModal(false); }}
                    className="h-16 rounded-xl bg-cover hover:ring-2 hover:ring-[#1b6b50] border border-gray-100"
                    style={{ backgroundImage: `url('${url}')` }}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Custom</p>
              <label className="flex items-center justify-center w-full h-10 bg-[#1b6b50] text-white text-sm font-medium rounded-xl hover:bg-[#155840] cursor-pointer">
                Upload from Device
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}