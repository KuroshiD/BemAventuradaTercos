import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ?? 'change_this_secret';

interface AuthRequest extends Request {
  authToken?: string;
  authUser?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7).trim() : undefined;

  if (!token) {
    res.status(401).json({ error: 'Token de autenticação ausente.' });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub?: string };
    req.authToken = token;
    req.authUser = payload.sub;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Token de autenticação inválido ou expirado.' });
  }
};
