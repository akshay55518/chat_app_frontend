import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";
import type { Conversation } from "../../types/api";
import { getConversationName, getInitials } from "../sidebar/ChatItem";

interface Props {
  conversation?: Conversation | null;
  isMe?: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ conversation, isMe, onClose }: Props) {
  const { user, token, setUser, logout } = useAuth();
  
  // State for editing (if isMe)
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user && isMe) {
      setFullName(user.full_name);
      setBio(user.bio || "");
      setAvatar(user.avatar || "");
    }
  }, [user, isMe]);

  // Derive profile info for the other person
  const otherEmail = conversation?.participants.find((p) => p.user !== user?.email)?.user;
  const otherName = conversation ? getConversationName(conversation, user?.email) : "Unknown";

  const profileData = isMe ? {
    name: user?.full_name,
    initials: user?.full_name ? getInitials(user.full_name) : "?",
    online: true,
    bio: user?.bio || "No bio set.",
    email: user?.email,
    avatarColor: "green",
    avatar: user?.avatar
  } : (conversation ? {
    name: otherName,
    initials: getInitials(otherName),
    online: false,
    bio: "No bio available.",
    email: otherEmail || "",
    avatarColor: "green",
    avatar: null
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
          bio: bio,
          avatar: avatar
        })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser)); // keep localStorage in sync
        setMessage("Profile updated successfully!");
        setEditMode(false);

      } else {
        setMessage("Failed to update profile.");
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
    <div className="w-80 min-w-80 border-l border-gray-200 flex flex-col bg-white overflow-y-auto shadow-xl z-10">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-tighter">
          {isMe ? "My Identity" : "Member Details"}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex-1">
        {/* Banner Decoration */}
        <div className="h-24 bg-gradient-to-r from-[#1b6b50]/10 to-[#c9e8dc]/30" />

        <div className="px-5 -mt-12 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-2xl border-4 border-white overflow-hidden ${colorClass}`}>
            {profileData.avatar ? (
              <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
            ) : (
              profileData.initials
            )}
          </div>
          
          <div className="mt-4 text-center">
            {isMe && editMode ? (
              <input 
                className="text-xl font-bold text-gray-900 text-center border-b-2 border-[#1b6b50] outline-none w-full bg-transparent"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                autoFocus
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-900 leading-tight">{profileData.name}</h3>
            )}
            
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${profileData.online ? "bg-green-500" : "bg-gray-400"}`} />
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                {profileData.online ? "Active Now" : "profile"}
              </span>
            </div>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`mx-5 mt-6 px-4 py-2 text-xs font-bold rounded-lg border ${message.includes("success") ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="px-5 mt-8 space-y-6">
          {/* Email Info */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Authenticated Email</span>
            <p className="text-sm text-gray-800 font-medium truncate">{profileData.email}</p>
          </div>

          {/* About Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Biography</span>
              {isMe && !editMode && (
                <button 
                  onClick={() => setEditMode(true)}
                  className="text-[10px] font-bold text-[#1b6b50] hover:underline"
                >
                  EDIT PROFILE
                </button>
              )}
            </div>
            
            <div className={`bg-gray-50 rounded-2xl p-4 border transition-all ${editMode ? "border-[#1b6b50] ring-1 ring-[#1b6b50]/10 bg-white" : "border-gray-100"}`}>
              {isMe && editMode ? (
                <textarea 
                  className="w-full text-sm text-gray-700 leading-relaxed bg-transparent border-none focus:ring-0 resize-none p-0 outline-none italic"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share something about yourself..."
                />
              ) : (
                <p className="text-sm text-gray-700 leading-relaxed italic">
                  "{profileData.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Avatar URL (if editing) */}
          {isMe && editMode && (
             <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Avatar URL</span>
              <div className="bg-gray-50 rounded-2xl p-4 border border-[#1b6b50] ring-1 ring-[#1b6b50]/10 bg-white">
                <input 
                  className="w-full text-sm text-gray-700 bg-transparent border-none focus:ring-0 p-0 outline-none"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 border-t border-gray-100">
        {isMe ? (
          editMode ? (
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setEditMode(false)}
                className="w-full border border-gray-200 text-gray-600 rounded-xl py-3 text-xs font-bold hover:bg-gray-50 transition-colors uppercase tracking-wider"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-[#1b6b50] text-white rounded-xl py-3 text-xs font-bold hover:bg-[#155840] transition-all shadow-lg shadow-[#1b6b50]/20 disabled:opacity-50 uppercase tracking-wider"
              >
                {isSaving ? "Syncing..." : "Save Changes"}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => logout()}
              className="w-full border border-red-200 text-red-600 rounded-xl py-3 text-xs font-bold hover:bg-red-50 transition-colors uppercase tracking-wider"
            >
              LogOut
            </button>
          )
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button className="border border-gray-200 rounded-xl py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 uppercase tracking-wider">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Block
            </button>
            <button className="bg-[#1b6b50] text-white rounded-xl py-3 text-xs font-bold hover:bg-[#155840] flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-[#1b6b50]/20">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
