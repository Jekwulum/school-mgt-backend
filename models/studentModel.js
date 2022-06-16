const mongoose = require("mongoose"),
    bcrypt = require("bcryptjs"),
    SALT_WORK_FACTOR = 10;

// student database
const studentDb = mongoose.Schema({
    student_id: {
        type: String,
        required: true,
        unique: true
    },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        },
        other: {
            type: String,
            required: false
        }
    },
    photo: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        lowercase: true
    },
    dob: {
        type: Date,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        unique: true,
        dropDups: true
    },
}, { timestamps: true })

// hashing password before saving
studentDb.pre('save', function(next) {
    var user = this;

    //  hash if the password has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
});
studentDb.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//
const Student = mongoose.model("Student", studentDb);

module.exports = Student;