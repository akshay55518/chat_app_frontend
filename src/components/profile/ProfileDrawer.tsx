import { useState, useEffect } from "react";
import { chats } from "../../data/chats";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

interface Props {
  activeChatId?: string;
  isMe?: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ activeChatId, isMe, onClose }: Props) {
  const { user, token, setUser } = useAuth();
  
  // State for editing (if isMe)
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const chat = chats.find((c) => c.id === activeChatId);

  // If viewing "Me", use the auth user data
  const profileData = isMe ? {
    name: user?.full_name,
    initials: user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase(),
    online: true,
    bio: user?.bio || "No bio set.",
    email: user?.email,
    avatarColor: "green"
  } : (chat ? {
    name: chat.name,
    initials: chat.initials,
    online: chat.online,
    bio: "Senior Editorial Director at The Pristine Workspace. Passionate about minimalist UI...",
    email: "j.thorne@editoria...",
    avatarColor: chat.avatarColor
  } : null);

  if (!profileData) return null;

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch(API_ENDPOINTS.UPDATE_ME, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: fullName,
          bio: bio
        })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setMessage("Profile updated successfully!");
      }
    } catch (err) {
      console.error("Update failed", err);
      setMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const colorClass =
    profileData.avatarColor === "blue"
      ? "bg-blue-100 text-blue-700"
      : profileData.avatarColor === "pink"
      ? "bg-pink-100 text-pink-700"
      : "bg-[#c9e8dc] text-[#1b6b50]";

  return (
    <div className="w-80 min-w-80 border-l border-gray-200 flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">{isMe ? "My Profile" : "User Profile"}</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Message Banner */}
      {message && (
        <div className={`px-4 py-2 text-xs font-medium text-center ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {message}
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex flex-col items-center pt-6 pb-4 gap-2">
        <div
          className={`w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-semibold ${colorClass}`}
        >
          {profileData.initials}
        </div>
        
        {isMe ? (
          <input 
            className="text-lg font-semibold text-gray-900 text-center border-b border-transparent focus:border-[#1b6b50] outline-none"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        ) : (
          <p className="text-lg font-semibold text-gray-900">{profileData.name}</p>
        )}
        
        <p className="text-sm text-green-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
          {profileData.online ? "Online" : "Offline"}
        </p>
      </div>

      {/* About Section */}
      <div className="mx-4 mb-4 bg-gray-50 rounded-xl p-4">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">About</p>
        {isMe ? (
          <textarea 
            className="w-full text-sm text-gray-700 leading-relaxed bg-transparent border-none focus:ring-0 resize-none p-0 outline-none"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed">
            {profileData.bio}
          </p>
        )}
      </div>

      {/* Info Grid */}
      <div className="mx-4 mb-4 grid grid-cols-1 gap-3">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Email</p>
          <p className="text-sm text-gray-800 truncate">{profileData.email}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mb-6 mt-auto">
        {isMe ? (
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-[#1b6b50] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#155840] transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Profile Changes"}
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button className="border border-gray-300 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5">
              🚫 Block
            </button>
            <button className="border border-[#1b6b50] rounded-xl py-2.5 text-sm font-medium text-[#1b6b50] hover:bg-[#eef2f0] flex items-center justify-center gap-1.5">
              ✉️ Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}