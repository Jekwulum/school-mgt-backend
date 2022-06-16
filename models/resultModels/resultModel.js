const mongoose = require("mongoose");

// Class database
const mathsDb = mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        unique: true
    },
    score: {
        type: Number,
        required: true
    },
    grade: String
});

const englishDb = mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        unique: true
    },
    score: {
        type: Number,
        required: true
    },
    grade: String
});

const frenchDb = mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        unique: true
    },
    score: {
        type: Number,
        required: true
    },
    grade: String
});

const scienceDb = mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        unique: true
    },
    score: {
        type: Number,
        required: true
    },
    grade: String
})