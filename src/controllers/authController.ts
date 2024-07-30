import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z, ZodError } from 'zod';
import prisma from '../utils/prisma';
import { config } from '../config/config';
import getZodErrorMessage from '../utils/getZodErrorMessage';

const signupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const signup = async (
  req: Request,
  res: Response,
) => {
  
  try {
    const { fullName, email, password } = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcryptSaltRounds
    );

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    res.status(201).json({
      status: 'success',
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessage= getZodErrorMessage(error);
       
          
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  }


const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const login = async (
  req: Request,
  res: Response,
) => {
  
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiresIn,
      }
    );

    res.json({
      status: 'success',
      data: {
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
};
