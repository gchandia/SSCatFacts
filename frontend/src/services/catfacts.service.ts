import { api } from './api';

export interface CatFactResponse {
  fact: string;
  length: number;
}

export interface LikedFact {
  id: string;
  fact: string;
  likedAt: string;
}

export interface PopularFact {
  id: string;
  fact: string;
  likesCount: number;
}

export const catFactsService = {
  async getRandomFact(): Promise<CatFactResponse> {
    const response = await api.get<CatFactResponse>('/facts/fact');
    return response.data;
  },

  async toggleLike(fact: string) {
    const response = await api.post<{ liked: boolean; message: string }>('/facts/like', { fact });
    return response.data;
  },

  async getMyLikes(): Promise<LikedFact[]> {
    const response = await api.get<LikedFact[]>('/facts/my-likes');
    return response.data;
  },

  async getPopularFacts(): Promise<PopularFact[]> {
    const response = await api.get<PopularFact[]>('/facts/popular');
    return response.data;
  },
};
