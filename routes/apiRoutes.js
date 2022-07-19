const express = require("express"),
    router = express.Router(),
    classRouter = require('./classRoutes'),
    courseRouter = require('./courseRoutes'),
    gradeRouter = require('./gradeRoutes'),
    staffRouter = require('./staffRoutes'),
    studentRouter = require('./studentRoutes');


router.use('/class', classRouter);
router.use('/course', courseRouter);
router.use('/student', studentRouter);
router.use('/staff', staffRouter);
router.use('/grade', gradeRouter);

// get all staff


module.exports = router;