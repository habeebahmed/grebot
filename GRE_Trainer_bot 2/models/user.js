const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    firstName:  {
      type: String,
      required: true
    },
    lastName:  {
      type: String,
      required: true
    },
    gender:  {
      type: String,
      required: true
    },
    userId:{
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    logs: {
      type: [Date],
      default: Date.now
    },
    email: {
      type: String
    },
    word_list:{
      type: Array,
    },
    total_questions :{
      type : Number,
      default : 0
    },
    total_correct : {
      type : Number,
      default : 0
    },
    total_wrong : {
      type : Number,
      default : 0
    }

});
// userSchema.pre('save', function(next){
//   this.logs.push(Date.now());
//   next();
// })

module.exports = mongoose.model('User', userSchema);
