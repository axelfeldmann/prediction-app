import express from 'express';
import mongoose from 'mongoose';

const League = mongoose.model('League');

const APIRouter = new express.Router();

APIRouter.get('/user', (req, res) => {
  res.status(200).json({
    username: req.username
  });
});

APIRouter.post('/newleague', (req, res) => {
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

module.exports = APIRouter;