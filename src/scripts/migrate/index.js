const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env)

// Database configuration
const dbType = process.env.DB_TYPE || 'mongoose'; // Use 'postgres' or 'mongoose' as database type

// Sequelize (PostgreSQL) setup
const sequelize = new Sequelize(process.env.POSTGRES_DATABASE_URL, {
  logging: false,
});

// Sequelize model
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
  paranoid: true, // Enable soft deletes
  timestamps: true, // Sequelize automatically handles createdAt and updatedAt
});

// Mongoose (MongoDB) setup
mongoose.connect(process.env.MONGODB_DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const TodoMongoose = mongoose.model('Todo', todoSchema);

// Function to seed example data only if the database is empty
async function seed() {
  try {
    console.log('Starting seed process...');

    const seedData = [
      { task: 'Buy Bread', completed: false },
      { task: 'Study JavaScript', completed: true },
      { task: 'Call Mom', completed: false },
    ];

    if (dbType === 'postgres') {
      // Check if database is empty (Sequelize)
      const count = await TodoSequelize.count();
      if (count === 0) {
        await TodoSequelize.bulkCreate(seedData);
        console.log('Data inserted with Sequelize (PostgreSQL).');
      } else {
        console.log('Database already contains data. Skipping seed.');
      }
    } else if (dbType === 'mongoose') {
      // Check if database is empty (Mongoose)
      const count = await TodoMongoose.countDocuments();
      if (count === 0) {
        await TodoMongoose.insertMany(seedData);
        console.log('Data inserted with Mongoose (MongoDB).');
      } else {
        console.log('Database already contains data. Skipping seed.');
      }
    } else {
      throw new Error('Unknown database type.');
    }

  } catch (error) {
    console.error('Error during seed process:', error);
  } finally {
    // Close the database connection
    if (dbType === 'postgres') {
      await sequelize.close();
    } else if (dbType === 'mongoose') {
      await mongoose.disconnect();
    }
  }
}

// Execute the seed function
seed();
