import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import autoIncrement from 'mongoose-auto-increment';

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  leagues: [{ type: Number, ref: 'League' }],
  invites: [{ type: Number, ref: 'League' }]
});

UserSchema.methods.comparePassword = function comparePassword(password, callback) {
  bcrypt.compare(password, this.password, callback);
};

UserSchema.pre('save', function saveHook(next) {
  const user = this;

  // proceed further only if the password is modified or the user is new
  if (!user.isModified('password')) return next();


  return bcrypt.genSalt((saltError, salt) => {
    if (saltError) { return next(saltError); }

    return bcrypt.hash(user.password, salt, (hashError, hash) => {
      if (hashError) { return next(hashError); }

      // replace a password string with hash value
      user.password = hash;

      return next();
    });
  });
});

UserSchema.plugin(autoIncrement.plugin, 'User');

module.exports = mongoose.model('User', UserSchema);