const status = require('http-status');

const loginError = () => {
  return {
    status: 400, type: status[400],
    message: 'Invalid Credentials'
  };
};

const userLoginResponse = () => {
  return {
    status: 202, type: status[202],
    message: 'Login Successful'
  };
};

const authenticationError = () => {
  return {
    status: 403, type: status[403],
    message: 'You do not have permission to perform this action'
  };
};

const InvalidTokenError = () => {
  return {
    status: 401, type: status[401],
    message: 'Invalid Token'
  };
};


module.exports = {
  loginError,
  userLoginResponse,
  authenticationError,
  InvalidTokenError,
}