import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

export const connect = (uri) => {

  mongoose.connect(uri);
  mongoose.Promise = global.Promise;

  autoIncrement.initialize(mongoose.connection);

  mongoose.connection.on('error', (err) => {
    console.log(err);
    process.exit(1);
  });

  require('./user');
  require('./league');
}