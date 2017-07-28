import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const LeagueSchema = new mongoose.Schema({
  leagueName: String,
  creatorID: Number,
  memberIDs: [Number],
  invitedIDs: [Number]
});

LeagueSchema.plugin(autoIncrement.plugin, 'League');
module.exports = mongoose.model('League', LeagueSchema);