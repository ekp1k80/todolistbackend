import { Request, Response } from "express";
import { z } from "zod";
import { TodoStrategyFactory } from "../../strategies/todo/todoStrategyFactory";

const dbType = process.env.DB_TYPE || 'postgres';  // Usar 'mongodb' o 'postgres'
const todoStrategy = TodoStrategyFactory.createStrategy(dbType);

// Zod Validation
const todoSchema = z.object({
  task: z.string().min(1, "Title is required"),
  completed: z.boolean().optional(),
});

// Controllers
export const createTodo = async (req: Request, res: Response) => {
  try {
    const data = todoSchema.parse(req.body);
    const todo = await todoStrategy.create(data);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: (error as {[key: string]: string}).message });
  }
};

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await todoStrategy.getAll();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving tasks" });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await todoStrategy.getById(id);

    if (!todo) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving task" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = todoSchema.parse(req.body);

    const todo = await todoStrategy.update(id, data);

    if (!todo) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ error: (error as {[key: string]: string}).message });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try { 
        await todoStrategy.delete(id);
    } catch(e) {
        return res.status(404).json({ error: "Task not found" });
    }   

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};
