const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recentSearchSchema = new Schema({
    query: String,
    timestamp: String
});

const RecentSearch = mongoose.model('RecentSearch', recentSearchSchema);

module.exports = RecentSearch;
