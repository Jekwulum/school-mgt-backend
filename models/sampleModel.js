const mongoose = require("mongoose"),
    bcrypt = require("bcrypt"),
    SALT_WORK_FACTOR = 10;

// creating a sample schema
const sampleDb = new mongoose.Schema({
    _id: { type: String },
    id: { type: String, required: true, index: { unique: true } },
    name: {
        first: String,
        last: String,
        other: String
    },
    email: { type: String, lowercase: true, required: true },
    password: { type: String, required: true },
    age: Number
});

// hashing password before saving
sampleDb.pre('save', function(next) {
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
})

// methods
sampleDb.methods.speak = function speak() {
    console.log(this.name.first + " " + this.name.last + `, age: ${this.age}`);
};

sampleDb.methods.comparePassword = function(userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

//
const sampledb = mongoose.model("Sample", sampleDb);


// this object acts as a container to "contain" our models
var dbLib = {
    sampleDb: sampledb,
}


module.exports = dbLib;