const mongoose       = require('mongoose');
mongoose.Promise = require('bluebird');
const RecentSearch   = require('./models/recentSearch');
const recentSearchDb = require('./models/recentSearchDb');

const compression  = require('compression');
const env          = require('node-env-file');
const express      = require('express');
const app          = express();

/**
 * To set up this API, a valid Client ID from imgur is required.
 * 
 * After registering the app with Imgur on their API page, 
 * add your key to a .env file in the root of the project as 
 * CLIENT_ID=[your valid id] for development. For production, 
 * either add the .env file the server (as long as it's not 
 * deployed through a public git repository), or export the 
 * environment variable directly on the production server.
 */


/**
 * Set up the Imgur API Client ID as an environment variable 
 */ 

// use a .env to declare process.env.CLIENT_ID in a development environment.
if (process.env.NODE_ENV !== 'production') {
    env(__dirname + '/.env');
}

/** 
 * Connect to MongoDB
 */

// dev URI
mongoose.connect('mongodb://localhost:27017/local');

const db = mongoose.connection;
db.on('error', console.error.bind(console, '\n ERROR: Mongoose encountered an error ->'));
db.once('open', () => console.log('\t\u2713 mongoDB connected...') );

/** 
 * Handle requests
 */

app.use(compression());
app.use('/', express.static(__dirname + '/public'));
app.use(require('./controllers'));

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('\n\t\u2713 Express app listening...');
});

module.exports = server;
