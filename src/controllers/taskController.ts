import { Request, Response, NextFunction } from "express";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../types/taskTypes";
import prisma from "../utils/prisma";
import { ZodError } from "zod";
import getZodErrorMessage from "../utils/getZodErrorMessage";

export const createTask = async (req: Request, res: Response) => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        ...data,
        userId: req.user!.id,
      },
    });
    res.status(201).json({ status: "success", data: { task } });
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessage = getZodErrorMessage(error);
  
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(400).json({ message: "Something went wrong" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ status: "success", data: { tasks } });
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessage = getZodErrorMessage(error);
  
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(400).json({ message: "Something went wrong" });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });
    res.json({ status: "success", data: { task } });
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessage = getZodErrorMessage(error);
  
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(400).json({ message: "Something went wrong" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const data = updateTaskSchema.parse(req.body);
    const task = await prisma.task.update({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: {
        ...data,
      },
    });
    res.json({ status: "success", data: { task } });
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessage = getZodErrorMessage(error);
  
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(400).json({ message: "Something went wrong" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    await prisma.task.delete({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });
    res.status(204).send();
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessage = getZodErrorMessage(error);
  
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(400).json({ message: "Something went wrong" });
  }
};
export const updateTaskStatus = async (req: Request, res: Response) => {
  try {
    const data = updateTaskStatusSchema.parse({
      ...req.body,
      id: req.params.id,
    });
    const task = await prisma.task.update({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
      data: {
        status: data.status,
      },
    });
    res.json({ status: "success", data: { task } });
  } catch (error) {
    if (error instanceof ZodError) {
        const errorMessage = getZodErrorMessage(error);
  
        return res.status(400).json({ message: errorMessage });
      }
      return res.status(400).json({ message: "Something went wrong" });
  }
};
