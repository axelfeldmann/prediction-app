import express from 'express';
import mongoose from 'mongoose';

const League = mongoose.model('League');
const User = mongoose.model('User');

const LeagueRouter = new express.Router();

const validateLeagueName = (name) => (
  (typeof name === 'string') && (name.length > 4) && (name.length < 32)
);

LeagueRouter.post('/new', (req, res) => {

  if(!validateLeagueName(req.body.leagueName))
    return res.status(400).json({
      success: false,
      message: 'bad league name'
    });

  const newLeague = new League({
    name: req.body.leagueName,
    creator: req.user._id,
    members: [req.user._id]
  });

  newLeague.save((err) => {

    if(err){

      if(err.code === 11000)
        return res.status(400).json({
          success: false,
          message: 'league name already taken - be more creative'
        })

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
    .populate({ path: 'creator members invites', select: 'username' })
    .exec((err, league) => {

      if(!league || err)
        return res.status(404).json({
          success: false,
          message: 'league not found'
        });

      const members = league.members.map((m) => m.username);

      if(!members.includes(req.user.username))
        return res.status(401).json({
          success: false,
          message: 'you are not a member of this league'
        });

      const leagueObj = {
        _id: league._id,
        name: league.name,
        creator: league.creator.username,
        members: members
      };

      if(league.creator.username === req.user.username){
        leagueObj.invites = league.invites.map(({ username }) => username);
      }

      res.status(200).json({
        success: true,
        league: leagueObj
      });

    });
});

LeagueRouter.get('/invites/:username', (req, res) => {
  const username = req.params.username;

  User
    .findOne({ username })
    .populate({ path: 'invites', select: 'name' })
    .exec((err, user) => {

      if(err || !user)
        return res.status(404).json({
          success: false,
          message: 'user not found'
        });

      const invites = user.invites.map(({ name }) => name);
      res.status(200).json({
        success: true,
        invites
      });

    });
});

LeagueRouter.post('/invite', (req, res) => {

  const leagueID = req.body.leagueID;

  League
    .findOne({ _id: leagueID })
    .populate({ path: 'creator invites members', select: 'username'})
    .exec((err, league) => {

      if(err)
        return res.status(500).json({
          success: false, message: 'not your fault, but your loss'
        });

      if(!league)
        return res.status(404).json({
          success: false, message: 'league not found'
        });

      if(league.creator.username !== req.user.username)
        return res.status(401).json({
          success: false, message: 'you cant invite to this league, you clown'
        });

      const members = league.members.map((m) => m.username);
      if(members.includes(req.body.invitee))
        return res.status(400).json({
          success: false, message: `${req.body.invitee} is already a member`
        });

      const invites = league.invites.map((i) => i.username);
      if(invites.includes(req.body.invitee))
        return res.status(400).json({
          success: false, message: `${req.body.invitee} is already invited`
        });

      User.findOne({ username: req.body.invitee }, 
        'invites _id', (err, user) => {
          
          if(err)
            return res.status(500).json({
              success: false, message: 'get user error, your loss'
            });

          if(!user)
            return res.status(400).json({
              success: false, message: 'user not found'
            });

          User.update({ _id: user._id }, { $push: { invites: leagueID } }, (err) => {

            if(err)
              return res.status(500).json({ success: false, message: 'user update failed' });

            League.update({ _id: leagueID }, { $push: { invites: user._id } }, (err) => {

              if(err)
                return res.status(500).json({ success: false, message: 'league update failed' });

              League
                .findOne({ _id: leagueID })
                .populate({ path: 'invites', select: 'username' })
                .exec((err, league) => {
                  if(err)
                    res.status(500).json({ success: false, message: 'failed to recover invites' });

                  res.status(200).json({
                    success: true,
                    invites: league.invites.map(({ username }) => username)
                  });
                });

            });

          });

        });

    });

});

LeagueRouter.post('/invite/accept', (req, res) => {
  res.status(200).json({
    success: true
  });
});

LeagueRouter.post('/invite/reject', (req, res) => {
  res.status(200).json({
    success: true
  });
});

module.exports = LeagueRouter;