var accountSid = 'ACd48994f8b5519fcdd48822353ec64b2f',
    authToken = 'bd0cd72dfe7e7d82a41cec4283f2058b';

var client = require('twilio')(accountSid, authToken);

client.calls.create({
    url: 'http://demo.twilio.com/docs/voice.xml',
    to: '+19188042101',
    from: '+19189927111'
},
function (err, call) {
    if(err) {
        console.log(err);
    } else {
        console.log(call.sid);
    }
});


