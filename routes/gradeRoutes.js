const express = require('express'),
  gradeRouter = express.Router();
const GradeController = require('../controllers/grade.controller');
const tokenValidator = require('../middlewares/helpers/validators/token.validator');


gradeRouter.get('/', tokenValidator.verifyToken, GradeController.getGrade);

gradeRouter.get('/:id', tokenValidator.verifyToken, GradeController.getGradeByStudentId);

gradeRouter.post('/', tokenValidator.verifyToken, GradeController.addGrade);

gradeRouter.put('/:id', tokenValidator.verifyToken, GradeController.updateGrade);

module.exports = gradeRouter;