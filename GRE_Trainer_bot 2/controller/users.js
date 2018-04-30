"use strict";
const mongoose = require('mongoose');
const users = mongoose.model('User');
var words = mongoose.model('dictionary');

exports.getInfo = async (req,res) => {
  res.header('Access-Control-Allow-Origin', "*")
  users.find({},(err,user) => {
    if (err) {
          console.log(err);
          res.json({
            success: false,
            message: 'Something went wrong in users db.'
          })
  }
  let total = user.length;
  let males = user.filter(u => {return u.gender == "male"}).length;
  let females = user.filter(u => {return u.gender == "female"}).length;

  res.json({
    total,
    males,
    females
  })
  })
}

exports.users = async (req,res) => {
  res.header('Access-Control-Allow-Origin', "*")
  users.find({},(err,user) => {
    if (err) {
          console.log(err);
          res.json({
            success: false,
            message: 'Something went wrong in users db.'
          })
      }
    const users_info = [];
    for (var i = 0; i < user.length; i++) {
      let name =user[i].firstName;
      let gender = user[i].gender;
      let total_questions = user[i].total_questions;
      let total_correct = user[i].total_correct;
      let total_wrong = user[i].total_wrong;
      let dt = user[i].createdAt;
      users_info.push({
        name,
        gender,
        total_questions,
        total_correct,
        total_wrong,
        dt
      })
    }

    res.json({
      users_info
    })

  })
}
