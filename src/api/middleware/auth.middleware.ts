import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/auth.service';

interface AuthRequest extends Request {
  authToken?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : undefined;

  if (!token) {
    res.status(401).json({ error: 'Token de autenticação ausente.' });
    return;
  }

  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Token de autenticação inválido.' });
    return;
  }

  req.authToken = token;
  next();
};
