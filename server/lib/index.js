
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from './config.json';

require('./models').connect(config.dburl);

//configure express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());


const LocalSignupStrategy = require('./passport/local-signup');
const LocalLoginStrategy = require('./passport/local-login');

passport.use('local-signup', LocalSignupStrategy);
passport.use('local-login', LocalLoginStrategy);


const AuthCheckMiddleware = require('./middleware/auth-check');

const AuthRoutes = require('./routes/auth');
const APIRoutes = require('./routes/api');

app.use('/api', AuthCheckMiddleware);

app.use('/api', APIRoutes);
app.use('/auth', AuthRoutes);

const port = 3001;
app.listen(port, () => console.log('running on ' + port));