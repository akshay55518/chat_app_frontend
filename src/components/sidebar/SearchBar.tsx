import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config/api";

interface Props {
  onSelectUser: (userId: number) => void;
  isCreating?: boolean;
}

export default function SearchBar({ onSelectUser, isCreating }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 2) { setResults([]); return; }
      setIsLoading(true);
      try {
        const res = await fetch(`${API_ENDPOINTS.SEARCH_USERS}?q=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setResults(await res.json());
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query, token]);

  const handleSelect = (userId: number) => {
    setSelectedUserId(userId);
    onSelectUser(userId);
    // Clear search on success (handled by parent usually, but we clear locally too)
    setQuery("");
    setResults([]);
  };

  return (
    <div className="px-3 pb-3 relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search users to chat..."
          className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#1b6b50] placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {(isLoading || (isCreating && selectedUserId)) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-[#1b6b50] border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute left-3 right-3 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map((u) => (
            <button
              key={u.id}
              onClick={() => handleSelect(u.id)}
              disabled={isCreating && selectedUserId === u.id}
              className="w-full p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-none text-left transition-colors disabled:opacity-60"
            >
              <div className="w-8 h-8 rounded-full bg-[#1b6b50] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {u.full_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{u.full_name}</p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>
              <span className="text-xs text-[#1b6b50] font-medium shrink-0">
                {isCreating && selectedUserId === u.id ? "Opening..." : "Message →"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}