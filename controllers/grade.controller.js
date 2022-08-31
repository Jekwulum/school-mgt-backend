const status = require('http-status');
const StudentDb = require('../models/studentModel');
const gradeGenerator = require('../middlewares/utils/generate.grade');
const { Course } = require('../models');
const { Grade } = require('../models');

const getGrade = async (req, res) => {
  try {
    let grades = await Grade.findAll();
    res.status(200).json({ status: "SUCCESS", message: "fetched records successfully", data: grades });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const getGradeByStudentId = async (req, res) => {
  try {
    Grade.findAll({ where: { student_id: req.params.id } })
      .then(grades => res.status(200).json({ status: "SUCCESS", data: grades }))
      .catch(err => res.status(400).json({ status: "FAILED", message: err }));
  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const addGrade = async (req, res) => {
  try {
    let studentExists = await StudentDb.findOne({ student_id: req.body.student_id });
    if (!studentExists) return res.status(404).json({ status: status[404], message: "student not found" });

    let course_code = req.body.course_code.toUpperCase();
    let courseExists = await Course.findOne({ where: { course_code: course_code } });
    if (!courseExists) return res.status(404).json({ status: status[404], message: "course not found" });

    let grade = gradeGenerator(req.body.score);
    if (grade === 'invalid') return res.status(400).json({ status: status[400], message: "invalid score. score must be in range 0 & 100" });

    await Grade.create({ ...req.body, course_code, grade })
      .then(async grade => res.status(201).json({ status: status[201], message: "success", data: grade }))
      .catch(err => res.status(400).json({ status: status[400], message: err.errors }));

  } catch (error) {
    res.status(500).json({ status: status[500], message: error });
  };
};

const updateGrade = async (req, res) => {
  try {
    let { student_id, course_code, score } = req.body;

    if (student_id !== undefined) {
      let studentExists = await StudentDb.findOne({ student_id: req.body.student_id });
      if (!studentExists) return res.status(404).json({ status: status[404], message: "student not found" });
    };

    if (course_code !== undefined) {
      let courseExists = await Course.findOne({ where: { course_code: req.body.course_code } });
      if (!courseExists) return res.status(404).json({ status: status[404], message: "course not found" });
    };

    if (score !== undefined) {
      let grade = gradeGenerator(score);
      if (grade === 'invalid') return res.status(400).json({ status: status[400], message: "invalid score. score should be between 0 & 100" });
    };

    Grade.update({ ...req.body, grade }, { where: { id: req.params.id } })
      .then(grade => res.status(200).json({ status: status[200], message: "success", data: grade }))
      .catch(err => res.status(400).json({ status: status[400], message: err }))
  } catch (error) {
    res.status(500).json({ status: status[500], message: error });
  };
};


module.exports = { getGrade, getGradeByStudentId, addGrade, updateGrade };