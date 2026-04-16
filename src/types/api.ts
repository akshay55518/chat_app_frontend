// Conversation types matching the backend API

export interface Participant {
  user: string; // email
  is_admin: boolean;
}

export interface Conversation {
  id: number;
  type: 'dm' | 'group';
  name: string | null;
  wallpaper: string | null;
  participants: Participant[];
  created_at: string;
}

// Message types matching the backend API
export interface ApiMessage {
  id: number;
  conversation: number;
  sender: string; // email
  type: 'text' | 'image' | 'audio';
  content: string;
  media_url: string | null;
  created_at: string;
}
