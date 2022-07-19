const CourseController = require('../controllers/course.controller');
const express = require('express'),
  courseRouter = express.Router();

courseRouter.get('/', CourseController.getCourse);

courseRouter.get('/:id', CourseController.getCourseByCode);

courseRouter.post('/', CourseController.createCourse);

courseRouter.put('/:id', CourseController.updateCourse);

module.exports = courseRouter;