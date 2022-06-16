const express = require('express'),
    studentRouter = express.Router(),
    classDB = require('../models/classModel'),
    staffDb = require('../models/staffModel'),
    studentDb = require('../models/studentModel');
const { updateController, flattenObject } = require('../middlewares/utils');


studentRouter.get("/get_student", async(req, res) => {
    const responseData = [];
    let students = await studentDb.find();
    if (students) {
        for (let i = 0; i < students.length; i++) {
            let data = students[i].toObject()
            delete data.password;
            responseData.push(flattenObject(data));
        };
        return res.status(200).json(responseData);
    };
    return res.status(404).json("records not found!");
});

studentRouter.get("/get_student/:id", async(req, res) => {
    let student = await studentDb.findOne({ student_id: req.params.id }).populate('student_class');
    if (student) {
        createdAt = JSON.stringify(student.createdAt).split("T")[0].replace('"', "");
        dob = JSON.stringify(student.dob).split("T")[0].replace('"', "");

        let teacher_id = String(student.student_class.teacher_id);
        teacher = await staffDb.findById(teacher_id);

        let responseData = flattenObject(student.toObject());
        delete responseData.password;
        responseData = {...responseData, createdAt, dob};
        
        return res.status(200).json({message: "Success", responseData});
    };
    return res.status(404).json("student not found");
});

studentRouter.put("/update_student/:id", async(req, res) => {
    let student = await studentDb.findOneAndUpdate({ student_id: req.params.id }, { new: true }).populate('student_class');
    if (student) {
        updatedStudent = await updateController(data = req.body,
            obj = student, studentClass = classDB);
        await updatedStudent.save();
        student = await updatedStudent.populate('student_class');
        dob = JSON.stringify(student.dob).split("T")[0].replace('"', "");

        let responseData = flattenObject(student);
        delete responseData.password;
        responseData = {...responseData, dob};

        return res.status(200).json({message: "Success", responseData});
    }
    return res.status(404).json({message: "student not found"});
});

studentRouter.delete("/delete_student/:id", async(req, res) => {
    studentExists = await studentDb.findOne({ student_id: req.params.id });
    if (studentExists) {
        await studentDb.deleteOne({ student_id: req.params.id });
        return res.status(200).json({message: "student deleted successfully"});
    } else return res.status(404).json({message: "student not found"});
});

module.exports = studentRouter;