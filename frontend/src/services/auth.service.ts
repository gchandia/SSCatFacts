import { api } from './api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}

export const authService = {
  async register(username: string, password: string) {
    const response = await api.post('/auth/register', { username, password });
    return response.data;
  },

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { username, password });
    return response.data;
  },
};
