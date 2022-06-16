
const { flattenObject } = require("../middlewares/utils");

const express = require("express"),
  classRouter = express.Router(),
  classDb = require('../models/classModel'),
  staffDb = require('../models/staffModel');

classRouter.get("/get_class", async (req, res) => {
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
    return res.status(200).json({ message: "success", responseData });
  };
});

classRouter.get("/get_class/:id", async (req, res) => {
  let className = req.params.id.toUpperCase()
  let getClass = await classDb.findOne({ name: className });
  if (getClass) {
    let teacher_id = getClass.teacher_id;
    let responseData = flattenObject(getClass.toObject());
    responseData = { ...responseData, teacher_id };
    return res.json({ message: "success", responseData });
  };
  res.status(400).json({ message: "record not found!" });
});

classRouter.post("/create_class", async (req, res) => {
  let classExists = await classDb.findOne({ name: req.body.name });
  if (classExists) return res.status(400).json({ message: "class already exists!" });

  newClass = await new classDb({
    name: req.body.name,
    subjects: req.body.subjects,
  });
  staffDb.findOne({ staff_id: req.body.staff_id }).exec(
    async function (err, staff) {
      if (err) {
        return res.status(400).json({ message: "couldn't create class!", err })
      };
      if (staff) {
        let staff_id = req.body.staff_id
        newClass.teacher_id = staff._id;
        await newClass.save((err, responseObj) => {
          if (err || !responseObj) return res.status(400).json({ "error": err });
          let responseData = flattenObject(newClass.toObject());
          responseData = { ...responseData, staff_id };

          return res.status(201).json({ message: "Class Created!", responseData });
        });
      } else return res.status(400).json({ message: "staff not found" });
    });
});

classRouter.put("/update_class/:id", async (req, res) => {
  let className = req.params.id.toUpperCase();
  let classExists = await classDb.findOne({ name: className });
  if (!classExists) return res.status(400).json({ message: "record not found" });

  let updatedClass = await classDb.findOneAndUpdate({ name: className }, req.body, { new: true });

  return res.status(200).json({ message: "success", updatedClass });
});

module.exports = classRouter;