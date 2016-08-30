const RecentSearch = require('./recentSearch');

/**
 * Queries the database for the 20 most recent searches
 * 
 * @param {object} res - Express response object
 * @returns {promise}
 */
exports.findRecentSearches = function (res) {

    return new Promise((resolve, reject) => {

        RecentSearch
        .find()
        .sort({ _id: -1 })
        .limit(20)
        .exec((err, result) => {

            if (err) {
                return reject(err);
            }

            let recentSearchQueries = formatResults(result);

            return resolve(recentSearchQueries);
        });
    });
};

/**
 * Saves the current search entry
 * 
 * @param {string} query - The search query as a param
 * @returns {promise} Returns a promise from Mongoose's .save() method
 */
exports.saveRecentSearch = function (query) {

    let newRecentSearch = new RecentSearch({
        query: query,
        timestamp: Date.now()
    }); 

    return newRecentSearch.save();
};

/**
 * Formats the found documents to display the search query, and 
 * the timestamp, converted to simplified ISO 8601 Extended Format:
 * http://www.ecma-international.org/ecma-262/5.1/#sec-15.9.1.15
 * 
 * @param {array} result - Results from the RecentSearches database query
 * @returns {array} An array of the formatted results
 */
function formatResults(result) {

    let formattedRecentQueries = result.map( search => {

        let convertedTimestamp = new Date(+search.timestamp);

        let formattedResult = {
            query: search.query,
            time: convertedTimestamp
        };

        return formattedResult;
    });

    return formattedRecentQueries;
}
