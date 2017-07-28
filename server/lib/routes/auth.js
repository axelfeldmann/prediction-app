import passport from 'passport';
import express from 'express';
import config from '../config';

const AuthRouter = new express.Router();

const validUsername = (username) => (
  (username) && 
  (typeof username === 'string') && 
  (username.length <= 16) && 
  (username.length >= 4) 
);

const validPassword = (password) => (
  (password) && 
  (typeof password === 'string') && 
  (password.length <= 32) && 
  (password.length >= 8) 
);

const validateLogin = ({ username, password }) => {
  if(!validUsername(username)){
    return { success: false, message: 'invalid username' };
  }
  if(!validPassword(password)){
    return { success: false, message: 'invalid password' };
  }
  return { success: true };
};

const validateSignup = ({ username, password, confirm }) => {
  if(!validUsername(username)){
    return { success: false, message: 'invalid username - must be between 4 and 16 characters' };
  }
  if(!validPassword(password)){
    return { success: false, message: 'invalid password - must be between 8 and 32 characters' };
  }
  if(password !== confirm){
    return { success: false, message: 'passwords do not match' };
  }
  return { success: true };
};

AuthRouter.post('/signup', (req, res, next) => {

  const validationResult = validateSignup(req.body);
  if(!validationResult.success){
    return res.status(400).json({
      success: false,
      message: validationResult.message
    });
  }

  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'duplicate') {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Username taken. Be more creative.'
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up!'
    });
  })(req, res, next);

});

AuthRouter.post('/login', (req, res, next) => {

  return passport.authenticate('local-login', (err, token, userData) => {

    const validationResult = validateLogin(req.body);
    if(!validationResult.success){
      return res.status(400).json({
        success: false,
        message: validationResult.message
      });
    }


    if (err) {
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    return res.json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);
});

module.exports = AuthRouter;