import express from 'express';

const APIRouter = new express.Router();

APIRouter.get('/user', (req, res) => {
  res.status(200).json({
    username: req.username
  });
});

module.exports = APIRouter;