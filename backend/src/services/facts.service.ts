import { prisma } from '../lib/prisma';

export interface PopularFactResponse {
  id: string;
  fact: string;
  likesCount: number;
}

export class FactsService {
  static async getPopularFacts(limit = 5): Promise<PopularFactResponse[]> {
    const popularLikes = await prisma.like.groupBy({
      by: ['factId'],
      _count: {
        factId: true,
      },
      orderBy: {
        _count: {
          factId: 'desc',
        },
      },
      take: limit,
    });

    if (popularLikes.length === 0) {
      return [];
    }

    const factIds = popularLikes.map((item) => item.factId);

    const facts = await prisma.fact.findMany({
      where: {
        id: {
          in: factIds,
        },
      },
      select: {
        id: true,
        factText: true,
      },
    });

    const factMap = new Map(facts.map((f) => [f.id, f.factText]));

    return popularLikes.map((item) => ({
      id: item.factId,
      fact: factMap.get(item.factId) || '',
      likesCount: item._count.factId,
    }));
  }
}
