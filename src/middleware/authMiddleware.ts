import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import prisma from '../utils/prisma';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}
export const userAuthMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let token: string | undefined;
  
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        token = req.headers.authorization.split(' ')[1];
      }
  
      if (!token) {
        return res.status(401).json({ message: 'Not authorized to access this route' });
      }
  
      const decoded = jwt.verify(token, config.jwtSecret) as {
        id: string;
        email: string;
      };
  
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true },
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized to access this route' });
    }
  };