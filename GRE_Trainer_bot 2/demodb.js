const mongoose = require('mongoose');
//const GRE_Words = require('./GRE_Words');
//var obj = GRE_Words.obj;
require('dotenv').config({ path: 'variables.env'});
var user = require('./models/user');
var words = require('./models/dictionary')
var correct ;
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`${err.message}`);
 });
 var list;
const axios = require('axios');
var url='http://localhost:8000/usersinfo';
axios.get(url)
.then((res) => {
  console.log(res.data);
})
//reading
// words.find({id:1020},(err,word) => {
//   console.log(word);
// })

// user.find({userId:'1870975672920645'},(err,users) => {
//
//   users[0].total_questions += 1;
//   //console.log(users[0].word_list.indexOf(143));;
//   users[0].save((err) => {
//     if (err) throw err;
//     console.log("updated \n"+users);
//   })
// })
// user.find({},(err,users) => {
//   if (err) {
//         console.log(err);
//         res.json({
//           success: false,
//           message: 'Something went wrong in users db.'
//         })
//     }
//     const us = [];
//     for (let i=0 ; i<users.length ; i++){
//     let name =users[i].firstName;
//     let gender = users[i].gender;
//     us.push({
//       name,
//       gender
//     })
//   }
//     console.log(us);
//
// })

// words.find({},(err,word) => {
//   if (err) throw err;
//   var length = word.length;
//   let difficult = word.filter(w => {return w.difficulty == "low"}).length
//   console.log(length);
// })


// words.find({id:4},(err,word) => {
//   if (err) throw err;
//
//   console.log(word[0].total);
//   console.log(word[0].answered);
//    word[0].total = word[0].total+1;
//    //word[0].answered = word[0].answered+1;
//    let temp = word[0].answered/word[0].total;
//    console.log(temp);
//    if ( temp > 0.5 ){
//      word[0].difficulty = 'low';
//      word[0].save((err) => {
//        if (err) throw err;
//
//        console.log("updated as "+word[0].difficulty);
//      })
//    } else{
//      word[0].difficulty = 'high';
//      word[0].save((err) => {
//        if (err) throw err;
//
//        console.log("updated as "+word[0].difficulty);
//      })
//    }
//
// })

var def1 = [];

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//console.log(obj.length);
var check = async () => {
  def1[0] = getRandomInt(1410);
  def1[1] = getRandomInt(1410);
  if(def1[0] === def1[1]){
  while(def1[0] === def1[1]){
    def1[1] =getRandomInt(1410);
  }
  }
  else {
  def1[2] = getRandomInt(1410);
  if(def1[2] === def1[1] || def1[2] === def1[0]){
    while(def1[2] === def1[1] || def1[2] === def1[0]){
      def1[2] = getRandomInt(1410);
    }
  }
  else{
    def1[3] = getRandomInt(1410);
    if(def1[3] === def1[2] || def1[3] === def1[1] || def1[3] === def1[0]){
      while(def1[3] === def1[2] || def1[3] === def1[1] || def1[3] === def1[0]){
        def1[3] =getRandomInt(1410);
      }
    }
    else{
      console.log(def1);
      correct = await getRandomInt(4)
      console.log(correct);

      await words.find({ id : {
              $in : [def1[0],def1[1],def1[2],def1[3]]
      }
      },(err,words)=>{
        if(err) throw err;
        def1 = words;
        verify(words);
      })

    //   user.findOneAndUpdate({userId:'1870975672920645'},{
    //     $push : {word_list:def1}
    //   }, function(err, users) {
    //     if (err) throw err;
    //
    // // object of all the users
    //     console.log(users);
    // });

    }
  }
  }
}
var verify = async (words) => {

  words[correct].flag = await  true;
  console.log(words);
}

//check()
