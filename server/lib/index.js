
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
const UserRoutes = require('./routes/user');
const LeagueRoutes = require('./routes/leagues');

app.use('/user', AuthCheckMiddleware);
app.use('/leagues', AuthCheckMiddleware);

app.use('/user', UserRoutes);
app.use('/auth', AuthRoutes);
app.use('/leagues', LeagueRoutes);

const port = 3001;
app.listen(port, () => console.log('running on ' + port));