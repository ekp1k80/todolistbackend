import { TodoStrategy } from './todoStrategy';
import { Todo } from '../../models/todoSequelizeModel'; // Mongoose model

export class TodoSequelizeStrategy implements TodoStrategy {
  async create(todo: any) {
    return await Todo.create(todo);
  }

  async getAll() {
    return await Todo.findAll();
  }

  async getById(id: string) {
    return await Todo.findByPk(id);
  }

  async update(id: string, todo: any) {
    const foundTodo = await Todo.findByPk(id);
    if (foundTodo) {
      return await foundTodo.update(todo);
    }
    return null;
  }

  async delete(id: string) {
    return new Promise<void>(async (resolve, reject) => {
        const foundTodo = await Todo.findByPk(id);
        if (foundTodo) {
          await foundTodo.destroy();
          resolve()
        }
        reject()
    })
    
  }
}
