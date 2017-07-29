import express from 'express';
import mongoose from 'mongoose';

const League = mongoose.model('League');
const User = mongoose.model('User');

const LeagueRouter = new express.Router();

LeagueRouter.post('/new', (req, res) => {

  const newLeague = new League({
    name: req.body.leagueName,
    creator: req.user._id,
    members: [req.user._id]
  });

  newLeague.save((err) => {

    if(err){

      console.log(err);
      res.status(500).json({
        success: false,
        message: 'error - could not create new league'
      });

    } else {

      User.update(
        { _id: req.user._id },
        { $push: { leagues: newLeague._id } },
        (err, arg2) => {
          console.log(err);
          console.log(arg2);
          res.status(200).json({
            success: true
          });
        }
      );

    }
  });
});

LeagueRouter.get('/', (req, res) => {
  
  User
    .findOne({ _id: req.user._id })
    .populate({ path: 'leagues', select: 'name' })
    .exec((err, user) => {
      if(err){

        res.status(500).json({
          success: false,
          message: 'error- could not get leagues'
        });

      } else {

        const leagues = user.leagues.map((l) => l.name);

        res.status(200).json({
          success: true,
          leagues
        });

      }
    });
});

LeagueRouter.get('/invites', (req, res) => {
  res.status(200).json({
    success: true
  });
});

LeagueRouter.post('/invite', (req, res) => {
  res.status(200).json({
    message: '/invite'
  });
});

module.exports = LeagueRouter;