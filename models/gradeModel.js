const db = require('../middlewares/config/sql_database');
const { DataTypes } = require('sequelize');
const Course = require('./courseModel.js');

const Grade = db.define('Grade', {
    student_id: { type: DataTypes.STRING, allowNull: false },
    course_code: {
        type: DataTypes.STRING, allowNull: false,
        references: { model: Course, key: 'course_code' }
    },
    grade: { type: DataTypes.STRING, allowNull: false },
    score: { type: DataTypes.INTEGER, allowNull: false }
});


module.exports = Grade;