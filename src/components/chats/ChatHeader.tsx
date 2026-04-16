import { useState, useEffect, useRef } from "react";
import { chats } from "../../data/chats";

interface Props {
  activeChatId: string;
  onOpenProfile: () => void;
  onSetWallpaper: () => void;
  onClearChat: () => void;
}

export default function ChatHeader({ activeChatId, onOpenProfile, onSetWallpaper, onClearChat }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const chat = chats.find((c) => c.id === activeChatId);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  if (!chat) return null;

  const colorClass =
    chat.avatarColor === "blue"
      ? "bg-blue-100 text-blue-700"
      : chat.avatarColor === "pink"
        ? "bg-pink-100 text-pink-700"
        : "bg-[#c9e8dc] text-[#1b6b50]";

  return (
    <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white z-10 relative shadow-sm">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={onOpenProfile}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${colorClass}`}
        >
          {chat.initials}
        </div>
        <div>
          <p className="text-[15px] font-semibold text-gray-900">{chat.name}</p>
          <p className="text-xs text-green-500">
            {chat.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button className="text-gray-500 hover:text-gray-700 text-lg transition-colors p-1 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </button>
        <button className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
              <button 
                onClick={() => {
                  onClearChat();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1b6b50] transition-colors"
              >
                Clear Chat
              </button>
              <button 
                onClick={() => {
                  alert("Chat has been exported!");
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1b6b50] transition-colors"
              >
                Export Chat
              </button>
              <button 
                onClick={() => {
                  onSetWallpaper();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#1b6b50] transition-colors"
              >
                Set Background Wallpaper
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}