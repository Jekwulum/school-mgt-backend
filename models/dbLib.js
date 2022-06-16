const Teacher = require("./teacherModel"),
    Class = require("./classModel");


let dbLib = {
    teacherDb: Teacher,
};

module.exports = dbLib;