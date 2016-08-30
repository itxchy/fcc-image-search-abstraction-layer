const recentSearchDb = require('../models/recentSearchDb');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    return recentSearchDb.findRecentSearches(res)
        .then( recentSearchQueries => {
            return res.json(recentSearchQueries);
        })
        .catch( err => {
            return res.status(500).send('A database error occured: ', err);
        });

});

module.exports = router;