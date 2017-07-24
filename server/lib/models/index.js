import mongoose from 'mongoose';

export const connect = (uri) => {
  mongoose.connect(uri);
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', (err) => {
    console.log(err);
    process.exit(1);
  });

  require('./user');
}