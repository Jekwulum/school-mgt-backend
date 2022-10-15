const StudentDb = require('../models/studentModel');
const gradeGenerator = require('../middlewares/utils/generate.grade');
const { Course } = require('../models');
const { Grade } = require('../models');

const CourseDb = require('../models/newCourseModel');
const GradeDb = require('../models/newGradeModel');

const getGrade = async (req, res) => {
  try {
    let grades = await GradeDb.find();
    res.status(200).json({ status: "SUCCESS", message: "fetched records successfully", data: grades });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const getGradeByStudentId = async (req, res) => {
  try {
    GradeDb.find({ student_id: req.params.id }, async (err, gradeObj) => {
      if (err || !gradeObj) res.status(404).json({ message: "record not found", status: "FAILED" });
      else return res.status(200).json({ status: "SUCCESS", message: "Fecthed records successfully", data: gradeObj });
    });
  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const addGrade = async (req, res) => {
  try {
    StudentDb.findOne({ student_id: req.body.student_id }, async (err, studentObj) => {
      if (err || !studentObj) return res.status(404).json({ message: "Student record not found", status: "FAILED" })
      else {
        let course_code = req.body.course_code.toUpperCase();
        CourseDb.findOne({ course_code }, async (err, courseObj) => {
          if (err || !courseObj) return res.status(404).json({ message: "Course record not found", status: "FAILED" });

          let grade = gradeGenerator(req.body.score);
          if (grade === 'invalid') return res.status(400).json({ status: "FAILED", message: "invalid score. score must be in range 0 & 100" });

          let newGrade = await new GradeDb({ ...req.body, course_code, grade });
          console.log("here 1");
          await newGrade.save(async (err, gradeObj) => {
            console.log("here 2")
            if (err || !gradeObj) return res.status(400).json({ status: "FAILED", message: err })
            else return res.status(201).json({ status: "SUCCESS", message: "Grade added", data: gradeObj });
          })
        })
      }
    });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const updateGrade = async (req, res) => {
  try {
    let { student_id, course_code, score } = req.body;

    if (student_id !== undefined) {
      let studentExists = await StudentDb.findOne({ student_id: req.body.student_id });
      if (!studentExists) return res.status(404).json({ status: "FAILED", message: "student not found" });
    };

    if (course_code !== undefined) {
      course_code = course_code.toUpperCase();
      let courseExists = await CourseDb.findOne({ course_code });
      if (!courseExists) return res.status(404).json({ status: "FAILED", message: "course not found" });
    };

    if (score !== undefined) {
      let grade = gradeGenerator(score);
      if (grade === 'invalid') return res.status(400).json({ status: "FAILED", message: "invalid score. score should be between 0 & 100" })
      else req.body = { ...req.body, grade };
    };

    GradeDb.findOne({ _id: req.params.id }, async (err, gradeObj) => {
      if (err || !gradeObj) return res.status(404).json({ message: "Grade record not found", status: "FAILED" });

      GradeDb.updateOne({ _id: req.params.id }, req.body, async (err) => {
        if (err) res.status(400).json({ status: "FAILED", message: err });
        else res.status(200).json({ status: "SUCCESS", message: "Record successfully updated" });
      });
    });

  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  };
};

const deleteGrade = async (req, res) => {
  try {
    let grade = await GradeDb.findOne({ _id: req.params.id });
    if (!grade) return res.status(404).json({ status: "FAILED", message: "Grade not found" });

    await GradeDb.deleteOne({ _id: req.params.id });
    res.status(200).json({ status: "SUCCESS", message: "record deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "FAILED", message: error });
  }
};

module.exports = { getGrade, getGradeByStudentId, addGrade, updateGrade, deleteGrade };