import jwt from 'jsonwebtoken';
import mongoose from 'mongoose'
import config from '../config.json';

const User = mongoose.model('User');

const AuthCheckMiddleware = (req, res, next) => {

  if(!req.headers.authorization) return res.status(401).end();

  const token = req.headers.authorization.split(' ')[1];

  return jwt.verify(token, config.secret, (err, decoded) => {
    if(err) return res.status(401).end();

    const userId = decoded.sub;

    return User.findById(userId, (userErr, user) => {
      if(userErr || !user) return res.status(401).end();
      req.user = user;
      return next();
    });
  });
};

module.exports = AuthCheckMiddleware;