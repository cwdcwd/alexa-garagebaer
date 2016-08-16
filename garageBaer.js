'use strict';

var _ = require('lodash');
var requestPromise = require('request-promise');

var API_BASEURL = 'http://garagebaer.herokuapp.com/api';
var API_ENDPOINT_STATE = '/state';
var API_ENDPOINT_OPERATE = '/operate';


function GarageBaer() {}

GarageBaer.prototype.getState = function() {
    var options = {
        method: 'GET',
        uri: API_BASEURL + API_ENDPOINT_STATE,
        json: true,
        timeout: 120000
    };
    console.log(options);
    return requestPromise(options);
}

GarageBaer.prototype.formatState = function(doorState) {
    var tmp = _.template('The garage door is currently ${state}');
    return tmp({
        state: doorState.state
    });
}

GarageBaer.prototype.interpretState = function(doorState) {
    doorState = doorState.toUpperCase();

    if ((doorState === 'SHUT') || (doorState === 'CLOSE')) {
        doorState = 'CLOSED';
    }

    return doorState;
}

GarageBaer.prototype.operate = function(doorState) {

    doorState = this.interpretState(doorState);
    var options = {
        method: 'POST',
        uri: API_BASEURL + API_ENDPOINT_OPERATE,
        body: {
            state: doorState
        },
        json: true
    };
    console.log(options);
    return requestPromise(options);
}



module.exports = GarageBaer;
