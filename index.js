'use strict';

module.change_code = 1;

var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('garagedoor');
var GarageBaer = require('./garageBaer');

var reprompt = 'The door services may be down but perhaps I didn\'t hear you correctly. could you repeat that?';

skill.launch(function(request, response) {
    var prompt = 'I can tell you the state of the door or operate it for you by saying open or close door';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
});

skill.intent('garagedoorStateIntent', {
        'slots': {
            'doorstate': 'DOORSTATES'
        },
        'utterances': ['{what is the|what\'s the|check the} {status|state}', 'is {the door|it} {-|doorstate}',
            'if {the door|it} is {-|doorstate}'
        ]
    },
    function(request, response) {
        console.log('requesting door state');
        var gb = new GarageBaer();
        gb.getState().then(function(resp) {
            console.log(resp);
            response.say(gb.formatState(resp)).send();
        }).catch(function(err) {
            console.log(err);
            var prompt = 'Something seems to have gone wrong! ';
            response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        });

        return false;
    }
);

skill.intent('garagedoorOperateIntent', {
        'slots': {
            'doorstate': 'DOORSTATES'
        },
        'utterances': ['to {-|doorstate}', '{-|doorstate} the {garage|door}']
    },
    function(request, response) {
        console.log('operating door');
        var doorstate = request.slot('doorstate');
        console.log('requested state is: ', doorstate);

        if (_.isEmpty(doorstate)) {
            var prompt = 'I\'m not sure what you wanted me to do with the garage door';
            console.log(prompt);
            response.say(prompt).reprompt(reprompt).shouldEndSession(false);
            return true;
        } else {
            var gb = new GarageBaer();
            gb.operate(doorstate).then(function(resp) {
                console.log(resp);
                response.say(gb.formatState(resp)).send();
            }).catch(function(err) {
                console.log(err);
                var prompt = 'Something seems to have gone wrong! ';
                response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
            });
        }

        return false;
    }
);

module.exports = skill;
