import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import PassportLocal from 'passport-local';
import config from '../config.json';

const PassportLocalStrategy = PassportLocal.Strategy;
const User = mongoose.model('User');

/**
 * Return the Passport Local Strategy object.
 */
const LocalLogin = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {

  const userData = {
    username,
    password
  };

  // find a user by username address
  return User.findOne({ username: userData.username }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      const error = new Error('Incorrect username or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) { return done(err); }

      if (!isMatch) {
        const error = new Error('Incorrect username or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user._id
      };

      // create a token string
      const token = jwt.sign(payload, config.secret);
      const data = {
        username: user.username
      };

      return done(null, token, data);
    });
  });
});

module.exports = LocalLogin;
