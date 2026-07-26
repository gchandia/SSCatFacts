import { Router } from 'express';
import { FactsService } from '../services/facts.service';
import { CatFactsController } from '../controllers/catfacts.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/popular', async (req, res) => {
  try {
    const popularFacts = await FactsService.getPopularFacts(5);
    res.json(popularFacts);
  } catch (error) {
    console.error('Error al obtener populares:', error);
    res.status(500).json({ error: 'Error al obtener los datos más populares' });
  }
});

router.get('/fact', CatFactsController.getRandomFact);

router.post('/like', authenticateToken, CatFactsController.toggleLike);
router.get('/my-likes', authenticateToken, CatFactsController.getMyLikes);

export default router;
