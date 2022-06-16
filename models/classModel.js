const mongoose = require("mongoose");

// Class database
const classDb = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    subjects: [{ type: String }],
    teacher_id: { type: mongoose.Schema.Types.ObjectId, ref: "Staff" }
})

//
const Class = mongoose.model("Class", classDb);

module.exports = Class;