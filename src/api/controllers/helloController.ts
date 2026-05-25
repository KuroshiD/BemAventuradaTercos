import { Request, Response } from 'express';
import { getHelloMessage } from '../services/helloService';

export const helloWorld = (_req: Request, res: Response): void => {
    res.json({ message: getHelloMessage() });
};
