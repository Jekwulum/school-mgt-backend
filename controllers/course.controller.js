const status = require('http-status');
const { Course } = require('../models');
const staffDb = require('../models/staffModel');


const getCourse = async (req, res) => {
  try {
    let courses = await Course.findAll();
    res.status(200).json({ status: "SUCCESS", message: "fetched records successfully", data: courses });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: `failed to fetch records: ${error}` });
  };
};

const getCourseByCode = async (req, res) => {
  try {
    let course = await Course.findOne({ where: { course_code: req.params.id } });
    if (course) return res.status(200).json({ status: "SUCCESS", message: "record fetched successfully", data: course });
    else return res.status(404).json({ status: "FAILED", message: "course not found" });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const createCourse = async (req, res) => {
  try {
    let { title, course_code, teacher_id } = req.body;
    let teacher = await staffDb.findOne({ staff_id: teacher_id });
    if (!teacher) return res.status(404).json({ status: "SUCCESS", message: "teacher not found" });

    Course.create({ title, course_code: course_code.toUpperCase(), teacher_id })
      .then(async course => res.status(201).json({ status: "SUCCESS", message: "Course created", data: course }))
      .catch(err => res.status(400).json({ status: "FAILED", message: err.errors }));

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
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