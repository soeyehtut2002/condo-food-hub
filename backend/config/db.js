const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for easy local development (no PostgreSQL required)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.SQLITE_DB_PATH || path.join(__dirname, '..', 'database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? false : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = sequelize;
