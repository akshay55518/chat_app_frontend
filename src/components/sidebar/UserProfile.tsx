interface Props {
    onOpen: () => void;
}

export default function UserProfile({ onOpen }: Props) {
    const { user } = useAuth();

    if (!user) return null;

    const initials = user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="p-3 flex items-center justify-between border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors" onClick={onOpen}>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1b6b50] flex items-center justify-center text-[15px] font-bold text-white shadow-sm">
                    {initials}
                </div>
                <div className="flex-1">
                    <p className="text-[15px] font-bold text-gray-900 leading-tight">{user.full_name}</p>
                    <p className="text-xs text-green-500 font-medium mt-0.5">Active Now</p>
                </div>
            </div>
            <div className="w-9 h-9 bg-gray-100 group-hover:bg-gray-200 text-gray-600 rounded-lg flex items-center justify-center transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
        </div>
    );
}