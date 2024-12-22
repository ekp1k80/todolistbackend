const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();
const dbType = process.env.DB_TYPE || 'mongoose'; // use 'postgres' o 'mongoose'

const sequelize = new Sequelize(process.env.POSTGRES_DATABASE_URL, {
  logging: false,
});

const TodoSequelize = sequelize.define('Todo', {
  task: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  paranoid: true, 
  timestamps: true,
});

mongoose.connect(process.env.MONGODB_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecting to mongoDB'))
  .catch((err) => console.error('Error :', err));

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const TodoMongoose = mongoose.model('Todo', todoSchema);

async function seed() {
  try {
    console.log('Seeding starting...');
    const seedData = [
      { task: 'Buy Bread', completed: false },
      { task: 'Study javascript', completed: true },
      { task: 'Call mom', completed: false },
    ];

    if (dbType === 'postgres') {
      const count = await TodoSequelize.count();
      if (count === 0) {
        await TodoSequelize.bulkCreate(seedData);
        console.log('Data inserted with Sequelize (PostgreSQL).');
      } else {
        console.log('Sequelize (PostgreSQL) already has data. Skipping seeding.');
      }
    } else if (dbType === 'mongoose') {
      const count = await TodoMongoose.countDocuments();
      if (count === 0) {
        await TodoMongoose.insertMany(seedData);
        console.log('Data inserted with Mongoose (MongoDB).');
      } else {
        console.log('Mongoose (MongoDB) already has data. Skipping seeding.');
      }
    } else {
      throw new Error('Unknown database type.');
    }
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    if (dbType === 'postgres') {
      await sequelize.close();
    } else if (dbType === 'mongoose') {
      await mongoose.disconnect();
    }
  }
}

seed();
