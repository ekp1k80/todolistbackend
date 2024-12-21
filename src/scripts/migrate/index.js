const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');
require('dotenv').config();

console.log('Loaded environment variables:', {
  DB_TYPE: process.env.DB_TYPE,
  POSTGRES_DATABASE_URL: process.env.POSTGRES_DATABASE_URL ? 'Loaded' : 'Missing',
  MONGODB_DATABASE_URL: process.env.MONGODB_DATABASE_URL ? 'Loaded' : 'Missing',
});

// Database configuration
const dbType = process.env.DB_TYPE || 'mongodb'; // Use 'postgres' or 'mongodb'

// Sequelize instance for PostgreSQL
const sequelize = new Sequelize(process.env.POSTGRES_DATABASE_URL, {
  logging: console.log, // Enable logging for debugging
});

// Define Sequelize model (PostgreSQL)
const TodoSequelize = sequelize.define(
  'Todo',
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
    timestamps: true, // Adds createdAt and updatedAt fields
    paranoid: true, // Adds deletedAt field for soft deletes
  }
);

// Mongoose model (MongoDB)
mongoose
  .connect(process.env.MONGODB_DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error with MongoDB:', err));

const todoSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TodoMongoose = mongoose.model('Todo', todoSchema);

// Migration function
async function migrate() {
  try {
    console.log('Starting migration...');

    if (dbType === 'postgres') {
      console.log('Using PostgreSQL (Sequelize)');
      // Register the Sequelize model before syncing
      await TodoSequelize.sync({ force: false }); // Do not drop existing tables
      console.log('PostgreSQL tables synchronized successfully.');
    } else if (dbType === 'mongodb') {
      console.log('Using MongoDB (Mongoose)');
      await TodoMongoose.init(); // Ensures collection and indexes are created
      console.log('MongoDB collections synchronized successfully.');
    } else {
      throw new Error(`Unknown database type: ${dbType}`);
    }
  } catch (error) {
    console.error('Error during migration:', error.message);
  } finally {
    // Close the connection after migration
    try {
      if (dbType === 'postgres') {
        await sequelize.close();
        console.log('PostgreSQL connection closed.');
      } else if (dbType === 'mongodb') {
        await mongoose.disconnect();
        console.log('MongoDB connection closed.');
      }
    } catch (disconnectError) {
      console.error('Error during disconnection:', disconnectError.message);
    }
  }
}

// Execute the migration
migrate();
