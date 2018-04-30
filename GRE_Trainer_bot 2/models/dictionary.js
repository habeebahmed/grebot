const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const wordsSchema = new mongoose.Schema({
    name:String,
    meaning:String,
    id:Number,
    flag: {
        type: Boolean,
        default: false
    },
    difficulty:String,
    answered:{
      type : Number,
    default : 0
  },
    total:{
      type : Number,
      default : 0
    }

});

module.exports = mongoose.model('dictionary', wordsSchema);
