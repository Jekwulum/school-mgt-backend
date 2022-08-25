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
      delete data.password;
      delete data.token;
      delete data.__v;
      let flattenedData = flattenObject(data);
      let studentData = { ...flattenedData, id };
      responseData.push(studentData);
    };
    return res.status(200).json({ message: "SUCCESS", data: responseData, status: status[200] });
  };
  return res.status(404).json({ status: status[404], message: "records not found!" });
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

    return res.status(200).json({ message: "SUCCESS", data: responseData, status: status[200] });
  };
  return res.status(404).json({ status: status[404], message: "student not found" });
};

const updateStudent = async (req, res) => {
  let student = await studentDb.findOneAndUpdate({ student_id: req.params.id }, { new: true });
  if (student) {
    let updatedStudent = await updateController(data = req.body, obj = student, studentClass = classDB);
    await updatedStudent.save();
    return res.status(200).json({ message: "SUCCESS", status: status[200] });
  }
  return res.status(404).json({ status: status[404], message: "student not found" });
};

const deleteStudent = async (req, res) => {
  studentExists = await studentDb.findOne({ student_id: req.params.id });
  if (studentExists) {
    await studentDb.deleteOne({ student_id: req.params.id });
    return res.status(200).json({ message: "SUCCESS", status: status[204], message: "student deleted successfully" });
  } else return res.status(404).json({ status: status[404], message: "student not found" });
};

const create = async (req, res) => {
  const studentExists = await studentDb.findOne({ email: req.body.email });
  if (studentExists) return res.status(400).json("Student Email already exists!");
  if (req.body.password !== req.body.confirmPassword) return res.status(404).json("passwords do not match!");

  const phoneExists = await studentDb.findOne({ phone: req.body.phone });
  if (phoneExists) return res.status(400).json({ message: "phone number already exists" });

  try {
    const cloudinary_response = await cloudinary.uploader.upload(req.body.photo, {
      folder: "mySchool"
    });

    let newStudent = await new studentDb({
      student_id: await generateID("stu", studentDb),
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
      photo: cloudinary_response.secure_url
    });
    newStudent.token = generateToken(newStudent._id, newStudent.student_id);
    newStudent.save((err, responseObj) => {
      if (err || !responseObj) return res.status(400).json({ "error": err });
      else {
        return res.status(201).json({ "message": "New Student added successfully!", access: newStudent.token });
      };
    });
  } catch (error) {
    console.log("error for try-catch: ", error);
    return res.status(500).json({ "message": "Internal Server Error" });
  }
};


module.exports = { getStudents, getStudentById, updateStudent, deleteStudent, create };