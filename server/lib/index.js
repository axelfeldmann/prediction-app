import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';

import LocalSignupStrategy from './passport/local-signup';
import LocalLoginStrategy from './passport/local-login';

import AuthCheckMiddleware from './middleware/auth-check';

import AuthRoutes from './routes/auth';
import APIRoutes from './routes/api';

import Models from './server/models';

//setup database connection
const dburl =
'mongodb://axel:king@ds045785.mlab.com:45785/predictions-app';
Models.connect(dburl);

//configure express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api', AuthCheckMiddleware);
app.use('/api', APIRoutes);
app.use('/auth', AuthRoutes);

const port = 3001;
app.listen(port, () => console.log('running on ' + port));