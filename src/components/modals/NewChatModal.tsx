import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

interface User {
  id: number;
  email: string;
  full_name: string;
  bio: string | null;
  avatar: string | null;
}

interface Props {
  onClose: () => void;
  onSelectUser: (userId: number) => void;
  isCreating: boolean;
}

export default function NewChatModal({ onClose, onSelectUser, isCreating }: Props) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const url = query.length >= 2 
          ? `${API_ENDPOINTS.SEARCH_USERS}?q=${query}`
          : `${API_ENDPOINTS.SEARCH_USERS}`; // List users if no query
        
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [query, token]);

  const handleSelect = (userId: number) => {
    setSelectedUserId(userId);
    onSelectUser(userId);
  };

  // Filter out the current user just in case backend didn't (safety net)
  const filteredUsers = users.filter(u => u.email !== user?.email);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop - ensure it covers the absolute full screen */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-[#eef2f0] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">New Message</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1b6b50] focus:ring-1 focus:ring-[#1b6b50]/20 transition-all"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <div className="w-8 h-8 border-3 border-[#1b6b50] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs font-medium">Looking for members...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="flex flex-col gap-1">
              <p className="px-3 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Suggested</p>
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user.id)}
                  disabled={isCreating && selectedUserId === user.id}
                  className="w-full group flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white transition-all text-left disabled:opacity-50"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-11 h-11 rounded-full bg-[#1b6b50] flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#1b6b50] transition-colors">
                      {user.full_name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="w-5 h-5 text-[#1b6b50]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center px-6">
              <div className="text-3xl mb-3 opacity-50">👥</div>
              <p className="text-sm font-medium text-gray-700">No members found</p>
              <p className="text-xs text-gray-500 mt-1">Try a different search term or check back later.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-gray-200 text-center">
          <p className="text-[11px] font-medium text-gray-400 tracking-widest"> <span className="text-black font-bold uppercase">{user?.full_name}</span> Chat Ecosystem</p>
        </div>

        {/* Overlay Loading for Selection */}
        {isCreating && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#1b6b50] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold text-[#1b6b50]">Initializing conversation...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
