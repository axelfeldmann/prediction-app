import express from 'express';

const APIRouter = new express.Router();

APIRouter.get('/user', (req, res) => {
  res.status(200).json({
    message: req.username
  });
});

module.exports = APIRouter;