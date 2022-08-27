const express = require('express');
const staffRouter = express.Router();
const StaffController = require('../controllers/staff.controller');
const tokenValidator = require('../middlewares/helpers/validators/token.validator');


staffRouter.get("/",
  tokenValidator.verifyToken,
  StaffController.getStaff
);

staffRouter.get("/:id",
  tokenValidator.verifyToken,
  StaffController.getStaffById
);

staffRouter.post("/",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  StaffController.create
);

staffRouter.put("/:id",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  StaffController.updateStaff
);

staffRouter.delete("/:id",
  tokenValidator.verifyToken,
  tokenValidator.adminValidator,
  StaffController.deleteStaff
);

module.exports = staffRouter;