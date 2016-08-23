/* global done */

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./server');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Server', () => {
    it('CLIENT_ID environment variable should be defined', () => {
        expect(process.env.CLIENT_ID).to.exist;
    });
});
