const { Sequelize, DataTypes } = require('sequelize');
const mongoose = require('mongoose');

// Database configuration
const dbType = process.env.DB_TYPE || 'mongoose'; // use 'sequelize' or 'mongoose'

const sequelize = new Sequelize('postgres://postgres:fede311299@localhost:5432/todoDB', {
  logging: false,
});


mongoose.connect('mongodb://localhost:27017/todoDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecting to MongoDB'))
  .catch((err) => console.error('Connection error with MongoDB:', err));

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const TodoMongoose = mongoose.model('Todo', todoSchema);

async function migrate() {
  try {
    console.log('Migration init...');

    if (dbType === 'postgres') {
      // Sincronizar con Sequelize (PostgreSQL)
      await sequelize.sync({ force: false }); // No borrar los datos previos
      console.log('Tables syncronized with Sequelize (PostgreSQL).');
    } else if (dbType === 'mongodb') {
      // Sincronización de la colección con Mongoose (MongoDB)
      // Mongoose maneja la creación de la colección automáticamente,
      // pero si necesitas forzar una acción, como asegurar que los índices estén creados:
      await TodoMongoose.init(); // Esto asegurará que Mongoose cree la colección si no existe
      console.log('Collections sincronized with Mongoose (MongoDB).');
    } else {
      throw new Error('Unknow database type.');
    }
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Cerrar la conexión
    if (dbType === 'postgres') {
      await sequelize.close();
    } else if (dbType === 'mongodb') {
      await mongoose.disconnect();
    }
  }
}

// Ejecutar la migración
migrate();
