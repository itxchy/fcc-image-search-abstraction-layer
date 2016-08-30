const mongoose       = require('mongoose');
mongoose.Promise = require('bluebird');
const RecentSearch   = require('./models/recentSearch');
const recentSearchDb = require('./models/recentSearchDb');

const compression  = require('compression');
const env          = require('node-env-file');
const request      = require('request-promise');
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

let clientID = process.env.CLIENT_ID;

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

app.get('/api/recent', (req, res) => {

    return recentSearchDb.findRecentSearches(res)
        .then( recentSearchQueries => {
            return res.json(recentSearchQueries);
        })
        .catch( err => {
            return res.status(500).send('A database error occured: ', err);
        });
});

app.get('/api/search/:query', (req, res) => {

    const query = req.params.query;
    const offset = req.query.offset || 1;
    let imgurURI = `https://api.imgur.com/3/gallery/search/?page=${offset}&q=${query}`;
    let requestOptions = {
        url: imgurURI,
        headers: {
            'authorization': `client-ID ${clientID}`
        }
    };

    request(requestOptions).then( apiResponse => {
        
        let body = JSON.parse(apiResponse);
        let formattedResults = formatResults(body);

        res.json(formattedResults);

        // returns Mongoose's save operation promise
        return recentSearchDb.saveRecentSearch(query);

    })

    .then(query => {
        console.log('query saved!', query);
    })

    .catch( error => {
        return res.status(500).end('A server error occured:', error);
    });

});

function formatResults(body) {

    let results = body.data.map( result => {

        if (result.cover) {
            return {
                image_source: result.link,
                image_url: `http://i.imgur.com/${result.cover}.jpg`,
                title: result.title,
                description: result.description
            };
        } else if (result.type) {
            return {
                image_source: `http://imgur.com/gallery/${result.id}`,
                image_url: result.link,
                title: result.title,
                description: result.description
            };
        } else {
            return {
                image_url: result.link,
                title: result.title,
                description: result.description  
            };     
        }
    });

    return results;
}

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('\n\t\u2713 Express app listening...');
});

module.exports = server;
