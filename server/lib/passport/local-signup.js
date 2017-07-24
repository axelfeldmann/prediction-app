import mongoose from 'mongoose';
import PassportLocal from 'passport-local';


const User = mongoose.model('User');


const PassportLocalStrategy = PassportLocal.Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {

  User.findOne({ username }, (err, user) => {
    if(user){
      return done({ code: 11000, name: 'MongoError' });
    } else{
      const userData = {
        username: username,
        password: password
      };
      const newUser = new User(userData);
      newUser.save((err) => {
        if(err) return done(err);
        return done(null);
      })
    }
  });
});
