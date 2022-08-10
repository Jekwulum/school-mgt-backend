'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const logger = require('../middlewares/utils/logger');
global.appRoot = path.resolve(__dirname);
global.appName = `School Management API`;

let sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
}
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    logger.info(`[Database connection]: Connected correctly to SQL server for ${appName}..`);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    logger.error(`2. Unable to connect to SQL Server. [Issue]: ${err}`)
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
