import express from 'express';

const APIRouter = new express.Router();

APIRouter.get('/user', (req, res) => {
  res.status(200).json({
    username: req.username
  });
});

APIRouter.post('/newleague', (req, res) => {
  console.log(req.body);
  res.status(200).json({
    success: true
  });
});

module.exports = APIRouter;