import express from 'express';

const APIRouter = new express.Router();

APIRouter.get('/id', (req, res) => {
  res.status(200).json({
    message: req
  });
});

module.exports = APIRouter;