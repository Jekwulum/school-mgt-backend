// const db = require('../middlewares/config/sql_database');
const db = require('./index');
const { DataTypes } = require('sequelize');

const Course = db.sequelize.define('Subject', {
    course_code: { type: DataTypes.STRING, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    teacher_id: { type: DataTypes.STRING, allowNull: false }
});


module.exports = Course;