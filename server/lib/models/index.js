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


// var mongoose = require('mongoose'),
//     Schema = mongoose.Schema,
//     autoIncrement = require('mongoose-auto-increment');
 
// var connection = mongoose.createConnection("mongodb://localhost/myDatabase");
 
// autoIncrement.initialize(connection);
 
// var bookSchema = new Schema({
//     author: { type: Schema.Types.ObjectId, ref: 'Author' },
//     title: String,
//     genre: String,
//     publishDate: Date
// });
 
// bookSchema.plugin(autoIncrement.plugin, 'Book');
// var Book = connection.model('Book', bookSchema);