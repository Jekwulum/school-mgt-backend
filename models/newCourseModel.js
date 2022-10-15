const mongoose = require('mongoose');

const courseDb = mongoose.Schema({
  title: { type: String, required: true },
  course_code: { type: String, required: true, unique: true },
  teacher_id: { type: String }
});

const Course = mongoose.model("Course", courseDb);

module.exports = Course;