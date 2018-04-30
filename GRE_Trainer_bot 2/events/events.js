const request = require('request');
require('dotenv').config({
  path: 'variables.env'
});
const mongoose = require('mongoose');
const users = mongoose.model('User');
var words = mongoose.model('dictionary');
// const GRE_Words = require('../GRE_Words');
// var obj = GRE_Words.obj;
var rounds = 0;
var correct = undefined;
var def1 = [];
var def2 = [];
score = 0;
var first_name;
var last_name;
var gen;
var user_id;
var email = false;
var fwd = false;

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function addGetStarted() {

  request({
    url: 'https://graph.facebook.com/v2.6/me/messenger_profile',
    qs: {
      access_token: process.env.token
    },
    method: 'POST',
    json: {
      "get_started": {
        "payload": "PAYLOAD:get_started"
      }
    }
  }, function(error, response, body) {
    //console.log("Add persistent menu " +body.first_name)
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
  //to remove persistent menu

  //   request({
  //     url: 'https://graph.facebook.com/v2.6/me/thread_settings',
  //     qs: { access_token: process.env.token },
  //     method: 'POST',
  //     json:{
  //         setting_type : "call_to_actions",
  //         thread_state : "existing_thread",
  //         call_to_actions:[ ]
  //     }
  //
  // }, function(error, response, body) {
  //     //console.log(response)
  //     if (error) {
  //         console.log('Error sending messages: ', error)
  //     } else if (response.body.error) {
  //         console.log('Error: ', response.body.error)
  //     }
  // })


}

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s",
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);
    console.log("rounds:" + rounds);

    if (quickReplyPayload === 'PAYLOAD:Start') {
      users.find({
        userId: user_id
      }, (err, user) => {
        console.log(user[0]);
        if (!user[0]) {

          request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
            json: true
          }, (err, res, body) => {
            if (err) {
              return console.log(err);
            }
            //console.log("body:"+body.id)

            user_id = body.id;
            users.find({
              userId: user_id
            }, (err, user) => {
              if (err) throw err;
              user[0].logs.push(Date.now());
              user[0].save((err) => {
                if (err) throw err;
                console.log("logs updated \n");
              })
            })
          })
        } else {
          user[0].logs.push(Date.now());
          user[0].save((err) => {
            if (err) throw err;
            console.log("logs updated \n");
          })
        }

      })
      sendQuickReplyChallenge(senderID);
      return;
    }
    if (quickReplyPayload === 'PAYLOAD:Instant') {

      users.find({
        userId: user_id
      }, (err, user) => {
        //console.log(user[0]);
        if (!user[0]) {

          request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
            json: true
          }, (err, res, body) => {
            if (err) {
              return console.log(err);
            }
            //console.log("body:"+body.id)

            user_id = body.id;
            users.find({
              userId: user_id
            }, (err, user) => {
              if (err) throw err;
              user[0].logs.push(Date.now());
              user[0].save((err) => {
                if (err) throw err;
                console.log("logs updated \n");
              })
            })
          })
        } else {
          user[0].logs.push(Date.now());
          user[0].save((err) => {
            if (err) throw err;
            console.log("logs updated \n");
          })
        }

      })
      rounds = 9;
      score = 0;
      sendToQuickReply(event);
      return;
    }
    if (quickReplyPayload === 'PAYLOAD:Subscribe') {
      let newUser = users({
        firstName: first_name,
        lastName: last_name,
        gender: gen,
        userId: user_id
      })
      newUser.save((err) => {
        if (err) {
          console.log(err);
        }
        console.log("saved ");
      })
      sendTextMessage(senderID, "please enter your valid Email address")
      email = true;
      return
    }
    if (quickReplyPayload === 'PAYLOAD:Challenge10') {
      rounds = 9;
      score = 0;
      //console.log("rounds in postback"+rounds);

      sendTextMessage(senderID, 'challenge of 10 questions selected');
      sendHiMessage(senderID, "https://i0.wp.com/www.the-arcade.ie/wp-content/uploads/2015/06/lets-do-this-ucas-gif.gif");
      setTimeout(function() {
        sendToQuickReply(event);
      }, 5000);
      return;
    }
    if (quickReplyPayload === 'PAYLOAD:Challenge20') {
      rounds = 19;
      score = 0;
      sendTextMessage(senderID, 'challenge of 20 questions selected')
      sendHiMessage(senderID, "https://i0.wp.com/www.the-arcade.ie/wp-content/uploads/2015/06/lets-do-this-ucas-gif.gif");
      setTimeout(function() {
        sendToQuickReply(event)
      }, 5000);
      return;
    } else {

      if (quickReplyPayload === 'PAYLOAD:true') {
        if(!def2[correct]){
          console.log("error at 224");
        }else {
          score++
          sendTextMessage(senderID, "correct 👌")
          if (rounds != 0) {
            setTimeout(function() {
              sendTextMessage(senderID, "your score is " + score)
            }, 80);
          }
          words.find({
            id: def2[correct].id
          }, (err, word) => {
            word[0].answered += 1;
            let temp = word[0].answered / word[0].total;

            if (temp > 0.5) {
              word[0].difficulty = 'low';
              word[0].save((err) => {
                if (err) throw err;

                console.log("updated as " + word[0].difficulty);
              })
            } else {
              word[0].difficulty = 'high';
              word[0].save((err) => {
                if (err) throw err;

                console.log("updated as " + word[0].difficulty);
              })
            }
          })

          users.find({
            userId: user_id
          }, (err, user) => {
            //console.log(user[0]);
            if (!user[0]) {

              request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
                json: true
              }, (err, res, body) => {
                if (err) {
                  return console.log(err);
                }
                //console.log("body:"+body.id)

                user_id = body.id;
                users.find({
                  userId: user_id
                }, (err, user) => {
                  if (err) throw err;

                  user[0].word_list.push(def2[correct].id);
                  user[0].total_questions += 1;
                  user[0].total_correct += 1;
                  //console.log(users[0].word_list.indexOf(143));;
                  user[0].save((err) => {
                    if (err) throw err;
                    console.log("incremented correct \n");
                  })
                })
              })
            } else {
              user[0].word_list.push(def2[correct].id);
              user[0].total_questions += 1;
              user[0].total_correct += 1;
              //console.log(users[0].word_list.indexOf(143));;
              user[0].save((err) => {
                if (err) throw err;
                console.log("incremented correct \n");
              })
            }

          })
        }


      } else {
        //sendTextMessage(senderID,"wrong")

        // console.log("something went wrong");
        console.log(def2);
        console.log(correct);
        if (!def2[correct]) {
          console.log("err at 288");
        } else {
          //let msg = "correct answer is "+a[correct].word
          sendTextMessage(senderID, "correct answer is " + def2[correct].name + " 😯")
          users.find({
            userId: user_id
          }, (err, user) => {
            //console.log(user[0]);

            if (!user[0]) {

              request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
                json: true
              }, (err, res, body) => {
                if (err) {
                  return console.log(err);
                }
                //console.log("body:"+body.id)

                user_id = body.id;
                users.find({
                  userId: user_id
                }, (err, user) => {
                  if (err) throw err;
                  user[0].word_list.push(def2[correct].id);
                  user[0].total_questions += 1;
                  user[0].total_wrong += 1;
                  //console.log(users[0].word_list.indexOf(143));;
                  user[0].save((err) => {
                    if (err) throw err;
                    console.log("incremented wrong \n");
                  })
                })
              })
            } else {
              user[0].word_list.push(def2[correct].id);
              user[0].total_questions += 1;
              user[0].total_wrong += 1;
              //console.log(users[0].word_list.indexOf(143));;
              user[0].save((err) => {
                if (err) throw err;
                console.log("incremented wrong \n");
              })
            }
          })
        }




      }


      if (rounds != 0)
        setTimeout(function() {
          sendToQuickReply(event)
        }, 400);
      else if (rounds == 0) {
        setTimeout(function() {
          sendTextMessage(senderID, "completed ✌️")
          sendTextMessage(senderID, "Your score is : " + score + " 🏆")
          setTimeout(function() {
            sendQuickReply2(senderID)

          }, 1000);
        }, 1000);
      }

      --rounds;
      //sendTextMessage(senderID, "Quick reply tapped");
      return;

    }
  }


  if (messageText) {
    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    if (email) {
      users.findOneAndUpdate({
          userId: user_id
        }, {
          email: messageText
        },
        function(err, user) {
          if (err) throw err;

          sendTextMessage(senderID, "email recorded:" + messageText);
          email = false;
          setTimeout(function() {
            sendQuickReply2(senderID)
          }, 200);
        }
      );

    } else {
      switch (messageText.replace(/[^\w\s]/gi, '').trim().toLowerCase()) {
        case 'hello':
        case 'hi':
          let url = "https://media2.giphy.com/media/l3q2GDh3wQqVWSiGY/giphy.gif";
          //  getBasicInfo(senderID);
          sendHiMessage(senderID, url);
          break;
        case 'start':
          users.find({
            userId: user_id
          }, (err, user) => {
          //  console.log(user[0]);

            if (!user[0]) {

              request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
                json: true
              }, (err, res, body) => {
                if (err) {
                  return console.log(err);
                }
                //console.log("body:"+body.id)

                user_id = body.id;
                users.find({
                  userId: user_id
                }, (err, user) => {
                  if (err) throw err;
                  user[0].logs.push(Date.now());
                  //console.log(users[0].word_list.indexOf(143));;
                  user[0].save((err) => {
                    if (err) throw err;
                    console.log("logs updated \n");
                  })
                })
              })
            } else {
              user[0].logs.push(Date.now());
              //console.log(users[0].word_list.indexOf(143));;
              user[0].save((err) => {
                if (err) throw err;
                console.log("logs updated \n");
              })
            }
          })
          sendQuickReplyChallenge(senderID);
          break;

        case 'status':
          sendStatus(senderID);
          break;

        default:
          sendTextMessage(senderID, "Type \'start\' to start the challenge");
      }
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}


function receivedDeliveryConfirmation(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var delivery = event.delivery;
  var messageIDs = delivery.mids;
  var watermark = delivery.watermark;
  var sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      console.log("Received delivery confirmation for message ID: %s",
        messageID);
    });
  }

  console.log("All message before %d were delivered.", watermark);
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  //  var payload = event.postback.payload;
  if (event.postback.payload === 'PAYLOAD:get_started') {


    request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
      json: true
    }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      //console.log("body:"+body.id)
      first_name = body.first_name;
      last_name = body.last_name;
      gen = body.gender;
      user_id = body.id;
      console.log("first_name:" + first_name + "\nlast_name:" + last_name + "\nuserId:" + user_id);
      users.find({
        userId: user_id
      }, (err, user) => {
        if (err) throw err;
        console.log(user);
        if (user.length === 0) {
          console.log("nothing found");
          sendQuickReplyStartNew(senderID, first_name, last_name)
        } else {
          sendQuickReplyStart(senderID, first_name, last_name);
        }
      })

    })
    //sendTextMessage(senderID,'Welcome '+first_name+' '+last_name+' \n Type \'start\' to start challenge');


  }

}

function sendStatus(recipientId) {
  users.find({
    userId: user_id
  }, (err, user) => {
    if (err) throw err;
    if (!user[0]) {
      request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
        json: true
      }, (err, res, body) => {
        if (err) {
          return console.log(err);
        }
        user_id = body.id;
        sendTextMessage(recipientId, "Your status:\nTotal questions - " + user[0].total_questions + "\nTotal correct - " + user[0].total_correct + "\nTotal wrong - " + user[0].total_wrong);
      })
    } else {
      sendTextMessage(recipientId, "Your status:\nTotal questions - " + user[0].total_questions + "\nTotal correct - " + user[0].total_correct + "\nTotal wrong - " + user[0].total_wrong);
    }
  })
}

function sendQuickReplyStart(recipientId, fn, ln) {

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      "text": "Welcome " + fn + " " + ln + "\nType 'start' or use QuickReply",
      "quick_replies": [{
        "content_type": "text",
        "title": "Begin",
        "payload": "PAYLOAD:Start",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/2000px-Red.svg.png"
      }, {
        "content_type": "text",
        "title": "Instant",
        "payload": "PAYLOAD:Instant",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/2000px-Red.svg.png"
      }]
    }
  }
  callSendAPI(messageData);

}

function sendQuickReplyStartNew(recipientId, fn, ln) {

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      "text": "Welcome " + fn + " " + ln + "\nGet subscribed for new features",
      "quick_replies": [{
        "content_type": "text",
        "title": "Subscribe 📝",
        "payload": "PAYLOAD:Subscribe"
      }]
    }
  }
  callSendAPI(messageData);

}


function sendQuickReply2(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      "text": "Wanna start",
      "quick_replies": [{
        "content_type": "text",
        "title": "Start",
        "payload": "PAYLOAD:Start",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/2000px-Red.svg.png"
      }, {
        "content_type": "text",
        "title": "Instant",
        "payload": "PAYLOAD:Instant",
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Red.svg/2000px-Red.svg.png"
      }]
    }
  }
  callSendAPI(messageData);
}




var sendToQuickReply = async (event) => {

  senderID = event.sender.id;
  def1[0] = getRandomInt(1410);
  def1[1] = getRandomInt(1410);
  if (def1[0] === def1[1]) {
    while (def1[0] === def1[1]) {
      def1[1] = getRandomInt(1410);
    }
  } else {
    def1[2] = getRandomInt(1410);
    if (def1[2] === def1[1] || def1[2] === def1[0]) {
      while (def1[2] === def1[1] || def1[2] === def1[0]) {
        def1[2] = getRandomInt(1410);
      }
    } else {
      def1[3] = getRandomInt(1410);
      if (def1[3] === def1[2] || def1[3] === def1[1] || def1[3] === def1[0]) {
        while (def1[3] === def1[2] || def1[3] === def1[1] || def1[3] === def1[0]) {
          def1[3] = getRandomInt(1410);
        }
      } else {
        console.log(def1);
        correct = getRandomInt(4)
        console.log(correct);

        await users.find({
          userId: user_id
        }, (err, user) => {
        //  console.log(user[0]);

          if (!user[0]) {

            request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
              json: true
            }, (err, res, body) => {
              if (err) {
                return console.log(err);
              }
              //console.log("body:"+body.id)

              user_id = body.id;
              users.find({
                userId: user_id
              }, (err, user) => {
                if (err) throw err;
                while (true) {
                  let check = user[0].word_list.includes(def1[correct]);
                  if (check) {
                    def1[correct] = getRandomInt(1410);
                    console.log("same word found");
                  }
                  else {
                    console.log("good going");
                    fwd = true;
                    if (user[0].word_list.length >= 1300) {
                      user[0].word_list = [];
                      user[0].save((err) => {
                        if (err) throw err;
                        console.log("wordlist reinitialized");
                      })
                    }
                    words.find({
                    id: {
                      $in: [def1[0], def1[1], def1[2], def1[3]]
                    }
                  }, (err, words) => {
                    if (err) throw err;
                    //console.log(words);
                    def2 = words;
                    fwd = false;
                    sendQuickReply(senderID, def2, correct)
                  })
                    break;
                  }
                }
              })
            })
          } else {

            while (true) {
              let check = user[0].word_list.includes(def1[correct]);
              if (check) {
                def1[correct] = getRandomInt(4);
                console.log("same word found");
              }
              else {
                console.log("good going");
                fwd = true;
                if (user[0].word_list.length >= 1300) {
                  user[0].word_list = [];
                  user[0].save((err) => {
                    if (err) throw err;
                    console.log("wordlist reinitialized");
                  })
                }
                words.find({
                id: {
                  $in: [def1[0], def1[1], def1[2], def1[3]]
                }
              }, (err, words) => {
                if (err) throw err;
                //console.log(words);
                def2 = words;
                fwd = false;
                sendQuickReply(senderID, def2, correct)
              })
                break;
              }
            }
          }
        })
      //   if(fwd) {
      //
      //       words.find({
      //       id: {
      //         $in: [def1[0], def1[1], def1[2], def1[3]]
      //       }
      //     }, (err, words) => {
      //       if (err) throw err;
      //       //console.log(words);
      //       def2 = words;
      //       fwd = false;
      //       sendQuickReply(senderID, def2, correct)
      //     })
      // }else {
      //   console.log("something went wrong");
      // }




      }
    }
  }


}


function receivedMessageRead(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  var watermark = event.read.watermark;
  var sequenceNumber = event.read.seq;

  console.log("Received message read event for watermark %d and sequence " +
    "number %d", watermark, sequenceNumber);
}

function receivedAccountLink(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  var status = event.account_linking.status;
  var authCode = event.account_linking.authorization_code;

  console.log("Received account link event with for user %d with status %s " +
    "and auth code %s ", senderID, status, authCode);
}

function getBasicInfo(senderID) {
  request('https://graph.facebook.com/v2.6/' + senderID + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.token, {
    json: true
  }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    //console.log("body:"+body);
    first_name = body.first_name;
    last_name = body.last_name;
    console.log("first_name:" + first_name + "\nlast_name:" + last_name);
  })
}

function sendHiMessage(recipientId, url) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      "attachment": {
        "type": "image",
        "payload": {
          "url": url,
          "is_reusable": true
        }
      }
    }
  }
  callSendAPI(messageData);
}

function sendQuickReply(recipientId, value, c) {
  value[c].flag = true;
  console.log(value);
  //  console.log(arr);
  console.log(c);
  console.log(value[c].name);
  console.log(value[c].meaning);
  words.find({
    id: value[c].id
  }, (err, word) => {
    word[0].total += 1;
    word[0].save((err) => {
      if (err) throw err;

      console.log("Total incremented : " + word[0].total);
    })
  })

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      "text": "Definition: " + value[c].meaning + "\n\nChoose from below words:",
      "quick_replies": [{
        "content_type": "text",
        "title": value[0].name + "🎯",
        "payload": "PAYLOAD:" + value[0].flag
      }, {
        "content_type": "text",
        "title": value[1].name + "🎯",
        "payload": "PAYLOAD:" + value[1].flag
      }, {
        "content_type": "text",
        "title": value[2].name + "🎯",
        "payload": "PAYLOAD:" + value[2].flag
      }, {
        "content_type": "text",
        "title": value[3].name + "🎯",
        "payload": "PAYLOAD:" + value[3].flag
      }]
    }
  }
  callSendAPI(messageData);
}


function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

function sendQuickReplyChallenge(recipientId) {

  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      "text": "Choose from below challenges",
      "quick_replies": [{
        "content_type": "text",
        "title": "Beginner(10)😎",
        "payload": "PAYLOAD:Challenge10"
      }, {
        "content_type": "text",
        "title": "Professional(20)😈",
        "payload": "PAYLOAD:Challenge20"
      }]


    }
  };

  callSendAPI(messageData);
}


function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: process.env.token
    },
    method: 'POST',
    json: messageData

  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s",
          messageId, recipientId);
      } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });
}



module.exports.receivedMessage = receivedMessage
module.exports.receivedPostback = receivedPostback
module.exports.receivedDeliveryConfirmation = receivedDeliveryConfirmation
module.exports.receivedAccountLink = receivedAccountLink
module.exports.receivedMessageRead = receivedMessageRead
module.exports.addGetStarted = addGetStarted;
