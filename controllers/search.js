const recentSearchDb = require('../models/recentSearchDb');
const request        = require('request-promise');
const express        = require('express');
const router         = express.Router();
const clientID       = process.env.CLIENT_ID;

router.get('/:query', (req, res) => {

    const query = req.params.query;
    const offset = req.query.offset || 1;
    let imgurURI = `https://api.imgur.com/3/gallery/search/?page=${offset}&q=${query}`;
    let requestOptions = {
        url: imgurURI,
        headers: {
            'authorization': `client-ID ${clientID}`
        }
    };

    // calls Imgur's API with the options above
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


/**
 * Formats the search results to display the correct links depending 
 * on the type of result, as well as the title and description of the 
 * image
 * 
 * @param {object} body - The body of Imgur's api response
 * @returns {array} Returns an array of the formatted search results
 */
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

module.exports = router;
