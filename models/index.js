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
  },
  logging: false
}
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`[Database connection]: Connected correctly to PostgresDB server for ${appName}..`);
    logger.info(`[Database connection]: Connected correctly to PostgresDB server for ${appName}..`);
  })
  .catch(err => {
    console.error(`Unable to connect to PostgresDB Server. [Issue]: ${err}`);
    logger.error(`Unable to connect to PostgresDB Server. [Issue]: ${err}`)
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
