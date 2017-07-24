import express from 'express';

const APIRouter = new express.Router();

APIRouter.get('/api2', (req, res) => {
  res.status(200).json({
    message: "You're authorized to see this secret message."
  });
});

module.exports = APIRouter;