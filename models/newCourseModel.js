const mongoose = require('mongoose');
const uuid = require('uuidv4');

const courseDb = mongoose.Schema({
  id: { type: String, required: true, unique: true, default: uuid() },
  title: { type: String, required: true },
  course_code: { type: String, required: true },
  teacher_id: { type: String }
});

module.exports = courseDb;