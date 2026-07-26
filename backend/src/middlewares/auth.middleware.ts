import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Acceso denegado. No se proporcionó un token de autenticación.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret_key';
    const decoded = jwt.verify(token, secret);

    req.user = decoded as { userId: string; username: string };

    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Token inválido o expirado.',
    });
  }
};
