const express = require('express');
const router = express.Router();
var events = require('../events/events')
var words = require('../controller/words')
var users = require('../controller/users')
// Do work here
router.get('/', (req, res) => {
  res.send('bot here')
});

router.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === process.env.verify_token ) {
    res.send(req.query['hub.challenge'])
  } else {
    res.send('Error, wrong token')
  }
})

router.post('/webhook',function(req,res){
  var data = req.body
  events.addGetStarted();
    // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched

    data.entry.forEach(function(pageEntry) {
      var pageID = pageEntry.id;
      var timeOfEvent = pageEntry.time;
      if(!pageEntry.messaging){
        return;
      }

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function(messagingEvent) {

        if (messagingEvent.message) {
          events.receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          events.receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          events.receivedPostback(messagingEvent);
        } else if (messagingEvent.read) {
          events.receivedMessageRead(messagingEvent);
        } else if (messagingEvent.account_linking) {
          events.receivedAccountLink(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }


      });
    });

    res.sendStatus(200);
  }



})

router.get('/words', words.getInfo);

router.get('/usersinfo', users.getInfo)

router.get('/users', users.users)

module.exports = router;
