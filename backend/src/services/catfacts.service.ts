import axios from 'axios';
import { prisma } from '../config/db';

const CAT_FACTS_API_URL = 'https://catfact.ninja';

export class CatFactsService {
  static async getRandomFact() {
    const response = await axios.get(`${CAT_FACTS_API_URL}/fact`);
    return response.data;
  }

  static async toggleLike(userId: string, factText: string) {
    let fact = await prisma.fact.upsert({
      where: { factText },
      update: {},
      create: { factText },
    });

    if (!fact) {
      fact = await prisma.fact.create({
        data: { factText },
      });
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_factId: {
          userId,
          factId: fact.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      return { liked: false, message: 'Me Gusta eliminado con éxito.' };
    } else {
      await prisma.like.create({
        data: {
          userId,
          factId: fact.id,
        },
      });
      return { liked: true, message: 'Me Gusta agregado con éxito.' };
    }
  }

  static async getUserLikedFacts(userId: string) {
    const likes = await prisma.like.findMany({
      where: { userId },
      include: {
        fact: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return likes.map((like) => ({
      id: like.fact.id,
      fact: like.fact.factText,
      likedAt: like.createdAt,
    }));
  }
}
