import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const LeagueSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  creator: { type: Number, ref: 'User' },
  members: [{ type: Number, ref: 'User' }],
  invites: [{ type: Number, ref: 'User' }]
});

LeagueSchema.plugin(autoIncrement.plugin, 'League');
module.exports = mongoose.model('League', LeagueSchema);