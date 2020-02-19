const HttpStatus = require('http-status-codes');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next) {
  // Get the token from the header if present
  const token = req.headers['x-access-token'] || req.headers['authorization'] || req.cookies['token'];

  // If no token found, return response (without going to the next middelware)
  if (!token) return res.status(HttpStatus.UNAUTHORIZED).send('Access denied. No token provided.');

  // If can verify the token, set req.user and pass to next middleware
  jwt.verify(token, config.tokenSecretKey, function(error, decoded) {
    if (error) {
      res.status(HttpStatus.UNAUTHORIZED).send('Access denied. Invalid token.');
    } else {
      req.user = decoded;
      next();
    }
  });
};