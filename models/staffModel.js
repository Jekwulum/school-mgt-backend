const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs"),
  SALT_WORK_FACTOR = 10;

const staffDb = mongoose.Schema({
  // _id: mongoose.Types.ObjectId,
  staff_id: {
    type: String,
    required: true,
    unique: true
  },
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
  gender: {
    type: String,
    lowercase: true
  },
  phone: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: false
  },
  is_staff: {
    type: Boolean,
    required: true,
    default: true
  },
  is_admin: {
    type: String,
    required: true,
    default: false
  },
  token: { type: String },
}, { timestamps: true });

staffDb.pre('save', function (next) {
  var user = this;

  //  hash if the password has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    })
  })
});
staffDb.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// 
const Staff = mongoose.model("Staff", staffDb);

module.exports = Staff;