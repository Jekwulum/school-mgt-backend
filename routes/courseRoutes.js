const express = require('express');
const CourseController = require('../controllers/course.controller');
const tokenValidator = require('../middlewares/helpers/validators/token.validator');
const courseRouter = express.Router();

courseRouter.get('/:course_code',
  tokenValidator.verifyToken,
  CourseController.getCourseByCode
);

courseRouter.get('/',
  tokenValidator.verifyToken,
  CourseController.getCourse
);

courseRouter.post('/',
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  CourseController.createCourse
);

courseRouter.put('/:course_code',
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  CourseController.updateCourse
);

courseRouter.delete('/:course_code',
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  CourseController.deleteCourse
);

module.exports = courseRouter;