import passport from 'passport';
import express from 'express';
import config from '../config';

const AuthRouter = new express.Router();

const validateSignup = ({ username, password, confirm }) => {

  let success = true, message = '';

  if(!username || typeof username !== 'string' || username.length < 4 || username.length > 16){
    success = false;
    message = 'username invalid - please make sure it has between 4 and 16 characters.';
  } else if(!password || typeof password !== 'string' || password.length < 8 || password.length > 32){
    success = false;
    message = 'password invalid - please make sure it has between 8 and 32 characters.';
  } else if(confirm !== password){
    success = false;
    message = 'passwords do not match - please make sure they do, then resubmit.';
  }
  return { success, message };
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
          message: 'Check the form for errors.'
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