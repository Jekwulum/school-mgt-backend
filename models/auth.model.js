const mongoose = require('mongoose');
const moment = require('moment');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const authTokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  expired: {
    type: Boolean,
    default: false
  },
  expireDate: {
    type: Date,
    default: moment().add(1, "hour")
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'UsersRef',
    required: true
  },
}, {
  timestamps: true
});

authTokenSchema.plugin(uniqueValidator);
const AuthTokens = mongoose.model('AuthTokens', authTokenSchema);

module.exports = AuthTokens;