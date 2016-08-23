# Image Search Extraction Layer

Another back end project for Free Code Camp.

Pass a search term to this API as a param. You'll get back image results from Imgur. 

If you add an offset param (i.e. `[url]/api/search/[image query]?offset=[number]`), you'll get back the request paginated page of results.

## Usage

`npm start` : Starts gulp's serve task. This will start express and nodemon, and process all source assets and land them in the public folder. The public folder will be served.  

`npm test` : Starts Mocha's test suite.

## Installation

1. Clone this repository
2. `npm install`
