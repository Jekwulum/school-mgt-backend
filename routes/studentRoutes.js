const express = require('express'),
  studentRouter = express.Router();
const tokenValidator = require('../middlewares/helpers/validators/token.validator');
const StudentController = require('../controllers/student.controller');


studentRouter.get("/",
  tokenValidator.verifyToken,
  StudentController.getStudents
);

studentRouter.get("/:id",
  tokenValidator.verifyToken,
  StudentController.getStudentById
);

studentRouter.post("/",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  StudentController.create
);

studentRouter.put("/:id",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  StudentController.updateStudent
);

studentRouter.delete("/:id",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  StudentController.deleteStudent
);

module.exports = studentRouter;