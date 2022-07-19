const status = require('http-status');
const classDb = require('../models/classModel');
const staffDb = require('../models/staffModel');
const { flattenObject } = require("../middlewares/utils/utils");

const getClass = async (req, res) => {
  const responseData = [];
  let allClasses = await classDb.find();
  if (allClasses) {
    for (let i = 0; i < allClasses.length; i++) {
      let teacher_id = allClasses[i].teacher_id;
      let data = flattenObject(allClasses[i].toObject());
      delete data.password;
      data = { ...data, teacher_id };
      responseData.push(data);
    };
    return res.status(200).json({ status: status[200], message: "success", data: responseData });
  };
};

const getClassById = async (req, res) => {
  let className = req.params.id.toUpperCase()
  let getClass = await classDb.findOne({ name: className });
  if (getClass) {
    let teacher_id = getClass.teacher_id;
    let responseData = flattenObject(getClass.toObject());
    responseData = { ...responseData, teacher_id };

    return res.status(200).json({ status: status[200], message: "success", data: responseData });
  };
  res.status(404).json({ status: status[404], message: "record not found!" });
};

const createClass = async (req, res) => {
  let classExists = await classDb.findOne({ name: req.body.name });
  if (classExists) return res.status(400).json({ status: status[400], message: "class already exists!" });

  newClass = await new classDb({
    name: req.body.name,
    subjects: req.body.subjects,
  });
  staffDb.findOne({ staff_id: req.body.staff_id }).exec(
    async function (err, staff) {
      if (err) return res.status(400).json({ status: status[400], message: "couldn't create class!", error: err });
      if (staff) {
        let staff_id = req.body.staff_id
        newClass.teacher_id = staff._id;
        await newClass.save((err, responseObj) => {
          if (err || !responseObj) return res.status(400).json({ status: status[400], "error": err });
          let responseData = flattenObject(newClass.toObject());
          responseData = { ...responseData, staff_id };

          return res.status(201).json({ status: status[201], message: "Class Created!", data: responseData });
        });
      } else return res.status(400).json({ status: status[400], message: "staff not found" });
    }
  );
};

const updateClass = async (req, res) => {
  let className = req.params.id.toUpperCase();
  let classExists = await classDb.findOne({ name: className });
  if (!classExists) return res.status(400).json({ status: status[400], message: "record not found" });

  let updatedClass = await classDb.findOneAndUpdate({ name: className }, req.body, { new: true });

  return res.status(200).json({ status: status[200], message: "success", data: updatedClass });
};


module.exports = { getClass, getClassById, createClass, updateClass };