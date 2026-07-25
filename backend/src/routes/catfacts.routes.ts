import { Router } from 'express';
import { CatFactsController } from '../controllers/catfacts.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/fact', CatFactsController.getRandomFact);

router.post('/like', authenticateToken, CatFactsController.toggleLike);
router.get('/my-likes', authenticateToken, CatFactsController.getMyLikes);

export default router;
