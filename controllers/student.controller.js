const status = require('http-status');
const classDB = require('../models/classModel');
const cloudinary = require('../middlewares/utils/cloudinary');
const studentDb = require('../models/studentModel');
const { updateController, flattenObject, generateID, generateToken } = require('../middlewares/utils/utils');

const getStudents = async (req, res) => {
  const responseData = [];
  let students = await studentDb.find();

  if (students) {
    for (let i = 0; i < students.length; i++) {
      let id = students[i]._id;
      let data = students[i].toObject()
      let dob = data.dob;
      delete data.password;
      delete data.token;
      delete data.__v;
      let flattenedData = flattenObject(data);
      let studentData = { ...flattenedData, id, dob };
      responseData.push(studentData);
      console.log("dob ", studentData);
    };
    return res.status(200).json({ status: "SUCCESS", data: responseData, message: "Successfully fetched students records" });
  };
  return res.status(404).json({ status: "FAILED", message: "records not found!" });
};

const getStudentById = async (req, res) => {
  let student = await studentDb.findOne({ student_id: req.params.id });
  if (student) {
    let createdAt = JSON.stringify(student.createdAt).split("T")[0].replace('"', "");
    let dob = JSON.stringify(student.dob).split("T")[0].replace('"', "");
    let id = student._id;

    let responseData = flattenObject(student.toObject());
    delete responseData.password;
    responseData = { ...responseData, createdAt, dob, id };

    return res.status(200).json({ status: "SUCCESS", data: responseData, message: "successfully fetched data" });
  };
  return res.status(404).json({ status: "FAILED", message: "student's record not found" });
};

const updateStudent = async (req, res) => {
  let student = await studentDb.findOneAndUpdate({ student_id: req.params.id }, { new: true });
  if (student) {
    let updatedStudent = await updateController(data = req.body, obj = student, studentClass = classDB);
    await updatedStudent.save();
    return res.status(200).json({ status: "SUCCESS", message: "record successfully updated" });
  }
  return res.status(404).json({ status: "FAILED", message: "student's record not found" });
};

const updatePhoto = async (req, res) => {
  let student = await studentDb.findOneAndUpdate({ student_id: req.params.id }, { new: true });
  if (student) {
    try {
      if (req.body.photo) {
        cloudinary.uploader.upload(req.body.photo, { folder: "mySchool" }, (err, result) => {
          if (err) return res.status(500).json({ "message": "Internal Server Error", status: "FAILED" });
          req.body.photo = result.secure_url;
        });
      }
    } catch (error) {
      return res.status(500).json({ status: "FAILED", message: "Internal Server Error" });
    }
    let updatedStudent = await updateController(data = req.body, obj = student, studentClass = classDB);
    await updatedStudent.save();
    return res.status(200).json({ status: "SUCCESS", message: "profile photo successfully updated" });
  }
  return res.status(404).json({ status: "FAILED", message: "student's record not found" });
};

const deleteStudent = async (req, res) => {
  let studentExists = await studentDb.findOne({ student_id: req.params.id });
  if (studentExists) {
    await studentDb.deleteOne({ student_id: req.params.id });
    return res.status(200).json({ status: "SUCCESS", message: "student's record deleted successfully" });
  } else return res.status(404).json({ status: "FAILED", message: "student not found" });
};

const create = async (req, res) => {
  const studentExists = await studentDb.findOne({ email: req.body.email });
  if (studentExists) return res.status(400).json({ message: "Student Email already exists!", status: "FAILED" });
  if (req.body.password !== req.body.confirmPassword) return res.status(404).json({ message: "passwords do not match!", status: "FAILED" });

  if (req.body.phone !== "") {
    const phoneExists = await studentDb.findOne({ phone: req.body.phone });
    if (phoneExists) return res.status(400).json({ message: "phone number already exists", status: "FAILED" });
  }

  let student_id = await generateID("stu", studentDb);

  cloudinary.uploader.upload(req.body.photo, { folder: "mySchool" }, (err, result) => {
    if (err) return res.status(500).json({ "message": "Internal Server Error", status: "FAILED" });
    let newStudent = new studentDb({
      student_id,
      password: req.body.password,
      name: {
        first: req.body.first,
        last: req.body.last,
        other: req.body.other
      },
      gender: req.body.gender,
      dob: req.body.dob,
      phone: req.body.phone,
      email: req.body.email,
      photo: result.secure_url
    });
    newStudent.token = generateToken(newStudent._id, newStudent.student_id);
    newStudent.save((err, responseObj) => {
      if (err || !responseObj) return res.status(400).json({ "message": err, status: "FAILED" });
      else {
        return res.status(201).json({ "message": "New Student added successfully!", access: newStudent.token, status: "SUCCESS" });
      };
    });
  });
  // } catch (error) {
  //   console.log("error for try-catch: ", error);
  //   return res.status(500).json({ "message": "Internal Server Error", status: "FAILED" });
  // }
};


module.exports = { getStudents, getStudentById, updateStudent, updatePhoto, deleteStudent, create };