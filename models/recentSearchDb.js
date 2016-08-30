const RecentSearch = require('./recentSearch');

exports.findRecentSearches = function (res) {

    return new Promise((resolve, reject) => {
        RecentSearch
        .find()
        .sort({ _id: -1 })
        .limit(20)
        .exec((err, result) => {

            if (err) {
                return reject(res.status(500).send('A database error occured: ', err));
            }

            let recentSearchQueries = result.map( search => {

                let convertedTimestamp = new Date(+search.timestamp);

                let formattedResult = {
                    query: search.query,
                    time: convertedTimestamp
                };

                return formattedResult;
            });

            return resolve(recentSearchQueries);
        });

    });

};