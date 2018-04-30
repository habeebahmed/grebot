const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env'});
var user = require('./models/user');
var words = require('./models/dictionary')
var correct ;
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise; // ES6 promises
mongoose.connection.on('error', (err) => {
  console.error(`${err.message}`);
 });

words.find({},(err,word) => {
  console.log(word.length);
})
