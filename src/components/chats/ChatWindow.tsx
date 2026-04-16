import { useState, useRef, useEffect } from "react";
import { messages as initialMessages } from "../../data/messages";
import type { Message } from "../../data/messages";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Props {
  activeChatId: string;
  onOpenProfile: () => void;
}

export default function ChatWindow({ activeChatId, onOpenProfile }: Props) {
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [wallpapers, setWallpapers] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem("chatWallpapers");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const wallpaper = wallpapers[activeChatId] || "";
  const [showWallpaperModal, setShowWallpaperModal] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, activeChatId]);

  const handleSend = (text: string) => {
    const newMsg: Message = {
      id: Date.now(),
      text,
      is_sender: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    };
    setChatMessages((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] ?? []), newMsg],
    }));
  };

  const currentMessages = chatMessages[activeChatId] ?? [];

  const handleSetWallpaper = () => {
    setShowWallpaperModal(true);
  };

  const updateWallpaper = (url: string) => {
    const updated = { ...wallpapers };
    if (url) {
      updated[activeChatId] = url;
    } else {
      delete updated[activeChatId];
    }
    
    setWallpapers(updated);
    try {
      localStorage.setItem("chatWallpapers", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save wallpaper to local storage (file might be too large)", e);
      alert("Image is too large to be saved permanently in your browser cache.");
    }
  };

  const setPresetWallpaper = (url: string) => {
    updateWallpaper(url);
    setShowWallpaperModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          updateWallpaper(reader.result as string);
          setShowWallpaperModal(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear this chat?")) {
      setChatMessages((prev) => ({ ...prev, [activeChatId]: [] }));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <ChatHeader 
        activeChatId={activeChatId} 
        onOpenProfile={onOpenProfile}
        onSetWallpaper={handleSetWallpaper}
        onClearChat={handleClearChat}
      />

      <div 
        className={`flex-1 overflow-y-auto p-4 flex flex-col gap-3 ${!wallpaper ? 'bg-[#f7faf8]' : 'bg-cover bg-center'}`}
        style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : undefined}
      >
        {/* <div className="self-center text-[11px] text-gray-400 bg-gray-200 px-3 py-1 rounded-full">
          TODAY
        </div> */}

        {currentMessages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={handleSend} />

      {/* Wallpaper Selection Modal */}
      {showWallpaperModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-80 p-5 flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Set Background</h3>
              <button onClick={() => setShowWallpaperModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">×</button>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Preset Wallpapers</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setPresetWallpaper("")} className="h-16 bg-[#f7faf8] rounded-xl border border-gray-200 flex items-center justify-center text-xs text-gray-400 hover:border-[#1b6b50]">Default</button>
                <button onClick={() => setPresetWallpaper("https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80")} className="h-16 bg-gradient-to-br from-green-300 to-blue-400 rounded-xl bg-cover hover:ring-2 hover:ring-[#1b6b50]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80')" }} />
                <button onClick={() => setPresetWallpaper("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80")} className="h-16 bg-gradient-to-r from-red-200 to-red-600 rounded-xl bg-cover hover:ring-2 hover:ring-[#1b6b50]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80')" }} />
                <button onClick={() => setPresetWallpaper("https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80")} className="h-16 bg-black rounded-xl bg-cover hover:ring-2 hover:ring-[#1b6b50]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80')" }} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Custom</p>
              <label className="flex items-center justify-center w-full h-10 bg-[#1b6b50] text-white text-sm font-medium rounded-xl hover:bg-[#155840] cursor-pointer transition-colors">
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