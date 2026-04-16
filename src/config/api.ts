const BASE_URL = 'http://127.0.0.1:8000';
const WS_BASE = 'ws://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  ME: `${BASE_URL}/api/auth/me`,
  UPDATE_ME: `${BASE_URL}/api/auth/me/update`,
  SEARCH_USERS: `${BASE_URL}/api/auth/search`,

  // Conversations
  CONVERSATIONS: `${BASE_URL}/api/conversations/`,
  CREATE_CONVERSATION: `${BASE_URL}/api/conversations/create`,
  CONVERSATION: (id: number) => `${BASE_URL}/api/conversations/${id}`,

  // Messages
  MESSAGES: (conversationId: number) => `${BASE_URL}/api/messages/${conversationId}`,
  SEND_MESSAGE: (conversationId: number) => `${BASE_URL}/api/messages/${conversationId}/send`,

  // WebSocket
  WS_CHAT: (conversationId: number, token: string) => `${WS_BASE}/ws/chat/${conversationId}/?token=${token}`,
};

export default BASE_URL;
