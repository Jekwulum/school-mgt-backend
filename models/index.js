'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const logger = require('../middlewares/utils/logger');
global.appRoot = path.resolve(__dirname);
global.appName = `School Management API`;

const CourseModel = require('./courseModel');
const GradeModel = require('./gradeModel');

let db = {};
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

const Course = CourseModel(sequelize, Sequelize);
const Grade = GradeModel(sequelize, Sequelize);

Grade.hasMany(Course, { foreignKey: 'courseId' });
Course.belongsTo(Grade);

// Course.sync({ force: true })
//   .then(() => {
//     console.log(`course synced`);
//     logger.info(`[Database connection]: Databases & tables created for ${appName}..`);
//   })
//   .catch(error => {
//     console.log(`course not synced ${error}`);
//     logger.error(`[Database connection]: Error synchronizing tables: ${error}..`);
//   });

// Grade.sync({ force: true })
//   .then(() => {
//     console.log(`grade synced`);
//     logger.info(`[Database connection]: Databases & tables created for ${appName}..`);
//   })
//   .catch(error => {
//     console.log(`grade not synced ${error}`);
//     logger.error(`[Database connection]: Error synchronizing tables: ${error}..`);
//   });



sequelize.sync({ alter: true })
  .then(() => {
    console.log(`[Database connection]: Databases & tables created for ${appName}..`);
    logger.info(`[Database connection]: Databases & tables created for ${appName}..`);
  })
  .catch(error => {
    console.log(`[Database connection]: Error synchronizing tables: ${error}..`);
    logger.error(`[Database connection]: Error synchronizing tables: ${error}..`);
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = { db, Course, Grade };
