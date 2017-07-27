import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

const LeagueSchema = new mongoose.Schema({
  name: String
});

LeagueSchema.plugin(autoIncrement.plugin, 'League');
module.exports = mongoose.model('League', LeagueSchema);