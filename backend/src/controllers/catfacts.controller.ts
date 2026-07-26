import { Request, Response } from 'express';
import { CatFactsService } from '../services/catfacts.service';

export class CatFactsController {
  static async getRandomFact(req: Request, res: Response) {
    try {
      const factData = await CatFactsService.getRandomFact();
      return res.status(200).json(factData);
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error al consultar la API de Cat Facts' });
    }
  }
  
  static async toggleLike(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { fact } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      if (!fact || typeof fact !== 'string') {
        return res.status(400).json({ error: 'El texto del hecho (fact) es requerido' });
      }

      const result = await CatFactsService.toggleLike(userId, fact);
      return res.status(200).json(result);
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error desconocido' });
    }
  }

  static async getMyLikes(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Usuario no autenticado' });
      }

      const likedFacts = await CatFactsService.getUserLikedFacts(userId);
      return res.status(200).json(likedFacts);
    } catch (error: unknown) {
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Error desconocido' });
    }
  }
}
