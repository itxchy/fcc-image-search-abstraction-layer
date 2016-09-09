# Image Search Extraction Layer

Another back end project for Free Code Camp.

Search for images using Imgur's API, and receive the results in JSON. You can also request a list in JSON of the 20 most recent image searches. 

Pagination is available for search results as well, so you can retrieve as many results as you need.

## Endpoints

`/api/search/`
`/api/recent/`

Pagination Query Parameter:
`offset`

## Examples

Image Search:
`this.site/api/search/grumpy cat`

Recent Searches:
`this.site/api/recent`

Image Search, page 8:
`this.site/api/search/grumpy cat?offset=8`

## Usage

`npm start` : Starts gulp's serve task. This will start express and nodemon, and process all source assets and land them in the public folder. The public folder will be served.  

`npm test` : Starts Mocha's test suite.

## Installation

1. Clone this repository
2. `npm install`
