import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', authenticateToken, (req: Request, res: Response) => {
  return res.json({
    message: 'Perfil accedido con éxito',
    user: req.user,
  });
});

export default router;
