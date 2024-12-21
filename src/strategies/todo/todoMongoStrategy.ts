import { TodoStrategy } from './todoStrategy';
import { TodoModel } from '../../models/todoMongoModel'; // Mongoose model

export class TodoMongoStrategy implements TodoStrategy {
  async create(todo: any) {
    const newTodo = new TodoModel(todo);
    return await newTodo.save();
  }

  async getAll() {
    return await TodoModel.find();
  }

  async getById(id: string) {
    return await TodoModel.findById(id);
  }

  async update(id: string, todo: any) {
    return await TodoModel.findByIdAndUpdate(id, todo, { new: true });
  }

  async delete(id: string) {
    await TodoModel.findByIdAndDelete(id);
  }
}