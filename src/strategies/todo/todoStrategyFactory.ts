import { connectMongoDB } from '../../database/mongoose';
import { TodoMongoStrategy } from './todoMongoStrategy';
import { TodoSequelizeStrategy } from './todoSequelizeStrategy';

export class TodoStrategyFactory {
  static createStrategy(dbType: string) {
    if (dbType === 'mongodb') {
			connectMongoDB()
      return new TodoMongoStrategy();
    } else if (dbType === 'postgres') {
      return new TodoSequelizeStrategy();
    } else {
      throw new Error('Database not supported');
    }
  }
}