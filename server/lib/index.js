import express from 'express';

var app = express();
const port = 3001;

import { MongoClient } from 'mongodb';

//todo: hide my password and stuff somewhere
const dburl =
'mongodb://axel:king@ds045785.mlab.com:45785/predictions-app';

var db;

//routes

app.get('/api', (req, res) => {
  res.json({ text: 'Hello World' });
});

//start up the server only if the database is running
MongoClient.connect(dburl, (err, database) => {
  if(err) return console.log(err);
  db = database;
  app.listen(port, () => {
    console.log('server running on ' + port);
  });
});