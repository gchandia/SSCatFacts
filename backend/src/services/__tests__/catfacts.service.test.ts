import { FactsService } from '../facts.service';
import { prisma } from '../../lib/prisma';

jest.mock('../../lib/prisma', () => ({
  prisma: {
    like: {
      groupBy: jest.fn(),
    },
    fact: {
      findMany: jest.fn(),
    },
  },
}));

describe('FactsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPopularFacts', () => {
    it('debe retornar un arreglo vacío si no hay likes registrados', async () => {
      (prisma.like.groupBy as jest.Mock).mockResolvedValue([]);

      const result = await FactsService.getPopularFacts(5);

      expect(result).toEqual([]);
      expect(prisma.like.groupBy).toHaveBeenCalledTimes(1);
    });

    it('debe retornar los hechos formateados y ordenados por likesCount', async () => {
      (prisma.like.groupBy as jest.Mock).mockResolvedValue([
        { factId: 'fact-1', _count: { factId: 3 } },
        { factId: 'fact-2', _count: { factId: 1 } },
      ]);

      (prisma.fact.findMany as jest.Mock).mockResolvedValue([
        { id: 'fact-1', factText: 'Cats sleep 70% of their lives' },
        { id: 'fact-2', factText: 'A group of cats is called a clowder' },
      ]);

      const result = await FactsService.getPopularFacts(5);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'fact-1',
        fact: 'Cats sleep 70% of their lives',
        likesCount: 3,
      });
      expect(result[1]).toEqual({
        id: 'fact-2',
        fact: 'A group of cats is called a clowder',
        likesCount: 1,
      });
    });
  });
});
