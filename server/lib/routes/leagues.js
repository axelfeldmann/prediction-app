import express from 'express';
import mongoose from 'mongoose';
import { validateLeagueName } from '../utils/validation';

const League = mongoose.model('League');
const User = mongoose.model('User');

const LeagueRouter = new express.Router();

LeagueRouter.post('/new', (req, res) => {

  const validationResult = validateLeagueName(req.body.leagueName);
  if(!validationResult.success)
    return res.status(400).send(validationResult.message);

  const newLeague = new League({
    name: req.body.leagueName,
    creator: req.user._id,
    members: [req.user._id]
  });

  newLeague.save((err) => {

    if(err){

      if(err.code === 11000)
        return res.status(400).send('league name taken - be more creative');

      return res.status(500).send('could not create league');

    } else {
      User.update(
        { _id: req.user._id },
        { $push: { leagues: newLeague._id } },
        (err) => {
          if(err)
            res.status(500).send('could not initialize new league');
          else 
            res.status(200).json({ });
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

        res.status(500).send('could not get leagues');

      } else {
        
        const leagues = user.leagues.map(({ _id, name, creator }) => ({
          _id, name, creator: creator.username
        }));

        res.status(200).json({
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
        return res.status(404).send('league not found');

      const members = league.members.map((m) => m.username);

      if(!members.includes(req.user.username))
        return res.status(401).send('you are not a member of this league');

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
        return res.status(404).send('user not found');

      res.status(200).json({
        invites: user.invites
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
        return res.status(500).send('not your fault, but your loss');

      if(!league)
        return res.status(404).send('league not found');

      if(league.creator.username !== req.user.username)
        return res.status(401).send('you cant invite to this league, clown');

      const members = league.members.map((m) => m.username);
      if(members.includes(req.body.invitee))
        return res.status(400).send(`${req.body.invitee} is already a member`);

      const invites = league.invites.map((i) => i.username);
      if(invites.includes(req.body.invitee))
        return res.status(400).send(`${req.body.invitee} is already invited`);

      User.findOne({ username: req.body.invitee }, 
        'invites _id', (err, user) => {
          
          if(err)
            return res.status(500).send('get user error, your loss');

          if(!user)
            return res.status(400).send('user not found');

          User.update({ _id: user._id }, { $push: { invites: leagueID } }, (err) => {

            if(err)
              return res.status(500).send('user update failed');

            League.update({ _id: leagueID }, { $push: { invites: user._id } }, (err) => {

              if(err)
                return res.status(500).send('league update failed');

              League
                .findOne({ _id: leagueID })
                .populate({ path: 'invites', select: 'username' })
                .exec((err, league) => {
                  if(err)
                    res.status(500).send('failed to recover invites');

                  res.status(200).json({
                    invites: league.invites.map(({ username }) => username)
                  });

                });

            });

          });

        });

    });

});

LeagueRouter.post('/accept-invite', (req, res) => {

  const leagueID = req.body.leagueID;
  const userID = req.user._id;

  League.update(
    { _id: leagueID },
    { $push: { members: userID }, $pull: { invites: userID } }, (err) => {

      if(err) 
        return res.status(500).send('failed to update league');

      User.update(
        { _id: userID },
        { $push: { leagues: leagueID }, $pull: { invites: leagueID } }, (err) => {

          if(err)
            return res.status(500).send('failed to update user leagues');

          return res.status(200).json({ });

        }

      );

    });

});

LeagueRouter.post('/reject-invite', (req, res) => {

  const leagueID = req.body.leagueID;
  const userID = req.user._id;

  League.update({ _id: leagueID }, { $pull: { invites: userID } }, (err) => {

    if(err)
      return res.status(500).send('failed to update leagues');

    User.update({ _id: userID }, { $pull: { invites: leagueID } }, (err) => {

      if(err)
        return res.status(500).send('failed to update users');

      return res.status(200).json({ });

    });

  });

});


LeagueRouter.post('/remove', (req, res) => {

  const leagueID = req.body.leagueID;
  const targetName = req.body.target;
  const removerName = req.user.username;

  User.findOne({ username: targetName }, '_id', (err, target) => {

    if(err)
      return res.status(404).send('could not find target user');

    League
      .findOne({ _id: leagueID })
      .populate({ path: 'creator', select: 'username _id'})
      .exec((err, league) => {

        if(err)
          return res.status(404).send('could not find league');

        //only allow creator or user themselves to perform remove
        const isAllowed = ((targetName === removerName) || 
          (league.creator.username === removerName)) && 
          (target._id != league.creator._id);

        const targetID = target._id;

        if(!isAllowed)
          return res.status(401).send('permission denied to remove user');

        //remove user from leagues
        League.update({ _id: leagueID },
          { $pull: { invites: targetID, members: targetID } }, (err) => {

            if(err)
              return res.status(500).send('could not remove user from league');

            //remove league from user
            User.update({ _id: targetID },
              { $pull: { invites: leagueID, leagues: leagueID } }, (err) => {

                if(err)
                  return res.status(500).send('user removal incomplete');

                //this is the final success
                return res.status(200).json({
                  message: 'successfully removed user'
                });

              });

          });

      });

  });

});


module.exports = LeagueRouter;