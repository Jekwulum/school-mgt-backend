const jwt = require('jsonwebtoken');
const AuthResponse = require('../responses/token.response');
const config = process.env;
const staffDb = require('../../../models/staffModel');

const tokenValidator = {
  verifyToken: (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
      const response = AuthResponse.authenticationError();
      return res.status(response.status).json({ status: response.type, message: response.message });
    };

    try {
      req.user = jwt.verify(token, config.TOKEN_KEY);
      // console.log(req.user);
    } catch (error) {
      const response = AuthResponse.InvalidTokenError();
      return res.status(response.status).json({ status: response.type, message: response.message });
    };

    return next();
  },

  adminValidator: async (req, res, next) => {
    let user_id = String(req.user.user_id);
    let user = await staffDb.findOne({ staff_id: user_id })
    if (!user.is_admin) {
      const response = AuthResponse.authenticationError();
      return res.status(response.status).json({ status: response.type, message: response.message });
    };

    return next();
  },

  staffValidator: async (req, res, next) => {
    let user_id = String(req.user.user_id);
    let user = await staffDb.findOne({ staff_id: user_id });
    if (!user.is_staff) {
      const response = AuthResponse.authenticationError();
      return res.status(response.status).json({ status: response.type, message: response.message });
    };

    return next();
  },
};


module.exports = tokenValidator;