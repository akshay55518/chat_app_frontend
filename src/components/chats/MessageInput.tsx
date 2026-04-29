import { useState } from "react";

interface Props {
  onSend?: (text: string) => void;
  onSendImage?: (file: File) => void;
}

const EMOJI_LIST = ["😀", "😂", "🥰", "😎", "🤔", "👍", "❤️", "🔥", "✨", "🙌", "🎉", "😢"];

export default function MessageInput({ onSend, onSendImage }: Props) {
  const [text, setText] = useState("");
  const [showMedia, setShowMedia] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const hasText = text.trim().length > 0;

  const handleSend = () => {
    if (!hasText) return;
    if (onSend) onSend(text.trim());
    setText("");
    setShowMedia(false);
    setShowEmoji(false);
  };

  return (
    <div className="border-t border-gray-200 bg-white relative">
      {/* Media Popover Menu */}
      {showMedia && (
        <div className="absolute bottom-full left-3 mb-2 w-48 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 py-2 flex flex-col z-50 transform origin-bottom-left animate-in fade-in zoom-in-95 duration-200">
          <label className="px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 w-full text-left transition-colors cursor-pointer">
            <span className="text-xl leading-none">🖼️</span>
            <span className="font-medium">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && onSendImage) onSendImage(file);
                setShowMedia(false);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      )}

      {/* Emoji Picker Popover Menu */}
      {showEmoji && (
        <div className="absolute bottom-full right-16 mb-2 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 p-3 z-50 grid grid-cols-4 gap-2 transform origin-bottom-right animate-in fade-in zoom-in-95 duration-200">
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setText((prev) => prev + emoji)}
              className="text-2xl hover:scale-125 transition-transform flex items-center justify-center p-1"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2.5">
        <button 
          onClick={() => {
            setShowMedia(!showMedia);
            setShowEmoji(false);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-lg leading-none transition-colors shrink-0 ${
            showMedia ? "bg-[#1b6b50] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          +
        </button>
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none focus:border-[#1b6b50] placeholder-gray-400"
            placeholder={isRecording ? "Recording audio..." : "Type your message here..."}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isRecording}
          />
        </div>
        <button 
          onClick={() => {
            setShowEmoji(!showEmoji);
            setShowMedia(false);
          }}
          className={`text-lg transition-colors shrink-0 px-1 ${
            showEmoji ? "text-[#1b6b50]" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          🙂
        </button>
        
        <button
          onClick={hasText ? handleSend : undefined}
          onPointerDown={!hasText ? () => setIsRecording(true) : undefined}
          onPointerUp={!hasText ? () => setIsRecording(false) : undefined}
          onPointerLeave={!hasText ? () => setIsRecording(false) : undefined}
          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${
            isRecording ? "bg-red-500 scale-110" : "bg-[#1b6b50] hover:bg-[#155840]"
          }`}
        >
          {hasText ? (
            <svg className="w-5 h-5 fill-white ml-1" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
