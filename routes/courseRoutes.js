const express = require('express');
const CourseController = require('../controllers/course.controller');
const tokenValidator = require('../middlewares/helpers/validators/token.validator');
const courseRouter = express.Router();

courseRouter.get('/', tokenValidator.verifyToken, CourseController.getCourse);

courseRouter.get('/:id', tokenValidator.verifyToken, CourseController.getCourseByCode);

courseRouter.post('/', tokenValidator.verifyToken, CourseController.createCourse);

courseRouter.put('/:id', tokenValidator.verifyToken, CourseController.updateCourse);

module.exports = courseRouter;