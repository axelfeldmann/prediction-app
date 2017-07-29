import express from 'express';
import mongoose from 'mongoose';

const League = mongoose.model('League');
const LeagueRouter = new express.Router();

LeagueRouter.post('/new', (req, res) => {
  const leagueData = { leagueName: req.body.leagueName };
  const newLeague = new League(leagueData);
  newLeague.save((err) => {
    if(err){
      console.log(err);
      res.status(500).json({
        success: false,
        message: 'error - could not create new league'
      });
    }
    res.status(200).json({
      success: true
    });
  });
});

LeagueRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    leagues: ['is', 'this', 'a', 'joke']
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