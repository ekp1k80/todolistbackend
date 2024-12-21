// models/todoModel.ts (Mongoose)

import mongoose, { Schema, Document } from 'mongoose';

export interface Todo extends Document {
  task: string;
  completed: boolean;
}

const TodoSchema: Schema = new Schema(
  {
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    paranoid: true, // softdelete
  }
);

export const TodoModel = mongoose.model<Todo>('Todo', TodoSchema);
