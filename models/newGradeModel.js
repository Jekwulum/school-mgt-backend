const mongoose = require('mongoose');
const { uuid } = require('uuidv4');

const gradeDb = mongoose.Schema({
  id: { type: String, required: true, unique: true, default: uuid() },
  course_code: { type: String, required: true },
  student_id: { type: String, required: true },
  score: { type: Number, required: true },
  grade: { type: String, required: true }
});

module.exports = gradeDb;