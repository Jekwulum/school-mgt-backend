// const db = require('../middlewares/config/sql_database');
const db = require('./index');
const { DataTypes } = require('sequelize');

const Course = db.sequelize.define('Subject', {
    id: {
        type: db.Sequelize.UUID,
        defaultValue: db.Sequelize.UUIDV4,
        primaryKey: true,
    },
    course_code: { type: DataTypes.STRING, unique: true },
    title: { type: DataTypes.STRING, allowNull: false },
    teacher_id: { type: DataTypes.STRING, allowNull: false }
});


module.exports = Course;