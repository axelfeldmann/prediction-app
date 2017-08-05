import passport from 'passport';
import express from 'express';
import config from '../config';
import { validateSignup, validateLogin } from '../utils/validation';

const AuthRouter = new express.Router();

AuthRouter.post('/signup', (req, res, next) => {

  const validationResult = validateSignup(req.body);
  if(!validationResult.success){
    return res.status(400).send(validationResult.message);
  }

  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'duplicate') {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).send('duplicate username, be more creative');
      }

      return res.status(400).send('could not process form');
    }

    return res.status(200).json({
      message: 'You have successfully signed up!'
    });
  })(req, res, next);

});

AuthRouter.post('/login', (req, res, next) => {

  return passport.authenticate('local-login', (err, token, userData) => {

    const validationResult = validateLogin(req.body);
    if(!validationResult.success){
      return res.status(400).send(validationResult.message);
    }

    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).send(err.message);
      }
      
      return res.status(400).send('could not process form');

    }
    return res.json({
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});

module.exports = AuthRouter;