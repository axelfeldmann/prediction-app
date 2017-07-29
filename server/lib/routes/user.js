import express from 'express';
import mongoose from 'mongoose';

const UserRouter = new express.Router();

UserRouter.get('/check', (req, res) => {
  res.status(200).json({
    username: req.username
  });
});

module.exports = UserRouter;