"use strict";
const mongoose = require('mongoose');
const users = mongoose.model('User');
var words = mongoose.model('dictionary');

exports.getInfo = async (req,res) => {
  res.header('Access-Control-Allow-Origin', "*")
  words.find({},(err,word) => {
    if (err) {
          console.log(err);
          res.json({
            success: false,
            message: 'Something went wrong in words db.'
          })
  }
  var length = word.length;
  var difficult = word.filter(w => {return w.difficulty == "high"}).length;
  var easy = word.filter(w => {return w.difficulty == "low"}).length
  res.json({
    length,
    difficult,
    easy
  })
  })

}
