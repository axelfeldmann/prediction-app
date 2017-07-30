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
      res.status(500).json({
        success: false,
        message: 'error - could not create new league'
      });

    } else {
      User.update(
        { _id: req.user._id },
        { $push: { leagues: newLeague._id } },
        (err) => {
          if(err)
            res.status(500).json({
              success: false,
              message: 'error - could not initialize new league'
            });
          else 
            res.status(200).json({
              success: true
            });
      });

    }
  });
});

LeagueRouter.get('/', (req, res) => {
  
  User
    .findOne({ _id: req.user._id })
    .populate({ path: 'leagues', select: 'name creator _id',
      populate: { path: 'creator', select: 'username' } })
    .exec((err, user) => {
      if(err){

        res.status(500).json({
          success: false,
          message: 'error- could not get leagues'
        });

      } else {
        
        const leagues = user.leagues.map(({ _id, name, creator }) => ({
          _id, name, creator: creator.username
        }));

        res.status(200).json({
          success: true,
          leagues
        });

      }
    });
});

LeagueRouter.get('/:leagueID', (req, res) => {

  const leagueID = parseInt(req.params.leagueID, 10);

  League
    .findOne({ _id: leagueID })
    .populate({ path: 'creator', select: 'username' })
    .exec((err, league) => {

      if(!league)
        return res.status(404).json({
          success: false,
          message: 'league not found'
        });

      if(!league.members.includes(req.user._id))
        return res.status(401).json({
          success: false,
          message: 'you are not a member of this league'
        });

      res.status(200).json({
        success: true,
        league: {
          _id: league._id,
          name: league.name,
          creator: league.creator.username
        }
      });

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