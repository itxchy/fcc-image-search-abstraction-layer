const compression = require('compression');
const Promise     = require('bluebird');
const env         = require('node-env-file');
const request     = require('request');
Promise.promisifyAll(request);
const express     = require('express');
const app         = express();

/* 
 * To set up this API, a valid Client ID from imgur is required.
 * 
 * After registering the app with Imgur on their API page, 
 * add your key to a .env file in the root of the project as 
 * CLIENT_ID=[your valid id] for development. For production, 
 * either add the .env file the server (as long as it's not 
 * deployed through a public git repository), or export the 
 * environment variable directly on the production server.
 */


// Set up the Imgur API authorization as an environment variable 

if (process.env.NODE_ENV !== 'production') {
    env(__dirname + '/.env');
}

let clientID = process.env.CLIENT_ID;

// Connect to MongoDB


// Handle requests

app.use(compression());

app.use('/', express.static(__dirname + '/public'));

app.get('/api/recent', (req, res) => {

});

app.get('/api/search/:query', (req, res) => {

    let query = req.params.query;
    let offset = req.query.offset || 1;
    let imgurURI = `https://api.imgur.com/3/gallery/search/?page=${offset}&q=${query}`;
    let requestOptions = {
        url: imgurURI,
        headers: {
            'authorization': `client-ID ${clientID}`
        }
    };

    request.getAsync(requestOptions, (err, apiResponse, body) => {

        if (err) {
            return res.status(500).end('Server error:', err);
        } 

        body = JSON.parse(body);

        res.json(body);

        return body;
    })

    .then(function (body) {
        console.log('body:', body);

        // write search query and time to database

    });

});

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('Express app listening!');
});

module.exports = server;
