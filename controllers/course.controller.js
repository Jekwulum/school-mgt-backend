// const { flattenObject } = require('../middlewares/utils/utils');
// const { Course } = require('../models');
const CourseDb = require('../models/newCourseModel');
const staffDb = require('../models/staffModel');


const getCourse = async (req, res) => {
  try {
    let courses = await CourseDb.find();
    res.status(200).json({ status: "SUCCESS", message: "fetched records successfully", data: courses });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: `failed to fetch records: ${error}` });
  };
};

const getCourseByCode = async (req, res) => {
  try {
    // let course = await Course.findOne({ where: { course_code: req.params.id } });
    let course = await CourseDb.findOne({ course_code: req.params.course_code });
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

    let newCourse = await new CourseDb({ title, course_code, teacher_id });
    await newCourse.save((err, responseObj) => {
      console.log(err);
      if (err || !responseObj) return res.status(400).json({ status: "FAILED", "error": err });
      return res.status(201).json({ status: "SUCCESS", message: "Class Created!", data: responseObj });
    })

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const updateCourse = async (req, res) => {
  try {
    let { teacher_id } = req.body;
    if (teacher_id !== undefined) {
      let teacherExists = await staffDb.findOne({ staff_id: teacher_id });
      if (!teacherExists) return res.status(404).json({ status: "FAILED", message: "teacher not found" });
    };

    let course_code = req.params.course_code.toUpperCase();
    CourseDb.findOne({ course_code }, async (err, doc) => {
      if (err || !doc) return res.status(404).json({ message: "Record not found", status: "FAILED" });
      CourseDb.updateOne({ course_code }, req.body, async (err) => {
        if (err) res.status(400).json({ status: "FAILED", message: err });
        else res.status(200).json({ status: "SUCCESS", message: "Record successfully updated" });
      });
    });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const deleteCourse = async (req, res) => {
  try {
    let course = await CourseDb.findOne({ course_code: req.params.course_code });
    if (!course) return res.status(404).json({ status: "FAILED", message: "course not found" });

    await CourseDb.deleteOne({ course_code: req.params.course_code });
    res.status(200).json({ status: "SUCCESS", message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  }
};

module.exports = { getCourse, getCourseByCode, createCourse, updateCourse, deleteCourse };