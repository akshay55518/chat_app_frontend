const BASE_URL = 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,
  ME: `${BASE_URL}/api/auth/me`,
  UPDATE_ME: `${BASE_URL}/api/auth/me/update`,
  SEARCH_USERS: `${BASE_URL}/api/auth/search`,
};

export default BASE_URL;
