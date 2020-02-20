const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = exports = {};

exports.auth = function(req, res, next) {
  // Get the token from the header if present
  const token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies['token'];

  // If no token found, return response (without going to the next middelware)
  if (!token) {
    const error = new Error('Access denied. No token provided.');
    error.isUnauthorized = true;
    return next(error);
  }

  // If can verify the token, set req.user and pass to next middleware
  jwt.verify(token, config.tokenSecretKey, function(error, decoded) {
    if (error) {
      const error = new Error('Access denied. Invalid token.');
      error.isUnauthorized = true;
      next(error);
    } else {
      req.user = decoded;
      next();
    }
  });
};

exports.authErrorHandler = function(error, req, res, next) {
  if (error && error.isUnauthorized) {
    const errorMessage = error.message || `${error}`;
    res.status(HttpStatus.UNAUTHORIZED).send(errorMessage);
  } else {
    next(error);
  }
};