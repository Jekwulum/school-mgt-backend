const ClassController = require('../controllers/class.controller');
const tokenValidator = require("../middlewares/helpers/validators/token.validator");

const express = require("express"),
  classRouter = express.Router();

classRouter.get("/",
  tokenValidator.verifyToken,
  ClassController.getClass
);

classRouter.get("/:id",
  tokenValidator.verifyToken,
  ClassController.getClassById
);

classRouter.post("/",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  ClassController.createClass
);

classRouter.put("/update_class/:id",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  ClassController.updateClass
);

module.exports = classRouter;