const status = require('http-status');
const Course = require('../models/courseModel');
const staffDb = require('../models/staffModel');


const getCourse = async (req, res) => {
  try {
    let courses = await Course.findAll();
    res.status(200).json({ status: status[200], message: "success", data: courses });

  } catch (error) {
    res.status(500).json({ message: error });
  };
};

const getCourseByCode = async (req, res) => {
  try {
    let course = await Course.findOne({ where: { course_code: req.params.id } });
    if (course) return res.status(200).json({ status: status[200], message: "success", data: course });
    else return res.status(404).json({ status: status[404], message: "course not found" });

  } catch (error) {
    res.status(500).json({ status: status[500], message: error });
  };
};

const createCourse = async (req, res) => {
  try {
    let { title, course_code, teacher_id } = req.body;
    let teacher = await staffDb.findOne({ staff_id: teacher_id });
    if (!teacher) return res.status(404).json({ message: "teacher not found" });

    Course.create({ title, course_code, teacher_id })
      .then(async course => res.status(201).json({ status: status[201], message: "success", data: course }))
      .catch(err => res.status(400).json({ status: status[400], message: err.errors }));

  } catch (error) {
    res.status(500).json({ status: status[500], message: error });
  };
};

const updateCourse = async (req, res) => {
  try {
    let { teacher_id } = req.body;
    if (teacher_id !== undefined) {
      let teacherExists = await staffDb.findOne({ staff_id: teacher_id });
      if (!teacherExists) return res.status(404).json({ status: status[404], message: "teacher not found" });
    };

    let course = await Course.findOne({ where: { course_code: req.params.id } });
    if (!course) return res.status(404).json({ message: "course not found" });

    let updated_course = await course.update(req.body);
    res.status(201).json({ status: status[201], message: "success", data: updated_course });

  } catch (error) {
    res.status(400).json({ status: status[400], message: error });
  };
};

module.exports = { getCourse, getCourseByCode, createCourse, updateCourse };