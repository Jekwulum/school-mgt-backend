const express = require("express"),
    router = express.Router(),
    classRouter = require('./classRoutes'),
    staffRouter = require('./staffRoutes'),
    studentRouter = require('./studentRoutes');

router.use(classRouter);
router.use(studentRouter);
router.use(staffRouter);

// get all staff


module.exports = router;