import express from 'express';

var app = express();
const port = 3001;
 
app.get('/api', (req, res) => {
  res.json({ text: 'Hello World' });
});
 
app.listen(port);

console.log('server running on ' + port);