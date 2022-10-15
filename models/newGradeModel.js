const mongoose = require('mongoose');

const gradeDb = mongoose.Schema({
  course_code: { type: String, required: true },
  student_id: { type: String, required: true },
  score: { type: Number, required: true },
  grade: { type: String, required: true }
});

const Grade = mongoose.model("Grade", gradeDb);

module.exports = gradeDb;