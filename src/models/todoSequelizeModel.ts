import { DataTypes, Model } from 'sequelize';
import sequelize  from '../database/sequelize';

export class Todo extends Model {}

Todo.init(
  {
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Todo',
    paranoid: true,
    timestamps: true,
  }
);
