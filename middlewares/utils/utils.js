const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (obj_id, user_id) => {
  return jwt.sign({ user_id, obj_id },
    process.env.TOKEN_KEY, { expiresIn: "2h" });
};

const updateController = async (data, obj, studentClassDb = null) => {
  if (studentClassDb !== null) {
    class_DB = await studentClassDb.findOne({ name: data.student_class });
  };

  for (const key in data) {
    if (key === "first" || key === "last" || key === "other") {
      obj.name[key] = data[key];
    } else if (key === "student_class") {
      obj[key] = class_DB._id;
    } else {
      obj[key] = data[key];
    };
  };
  return obj;
};

function pad(n, length) {
  var len = length - ('' + n).length;
  return (len > 0 ? new Array(++len).join('0') : '') + n
}

const generateID = async (idType, dbModel) => {
  let count = await dbModel.countDocuments() + Math.floor(Math.random() * 700);
  let padDigit = pad(count, 3);
  let new_id = idType + String(padDigit);

  // if (idType === "stf" && dbModel.findOne({staff_id: new_id})) new_id = generateID("stf", dbModel);
  // else if (idType === "stu" && dbModel.findOne({student_id: new_id})) new_id = generateID("stu", dbModel);
  
  return new_id;
};

const flattenObject = (obj) => {
  const flattened = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value))
    } else {
      flattened[key] = value
    }
  })

  return flattened
}



module.exports = { generateToken, updateController, generateID, flattenObject };