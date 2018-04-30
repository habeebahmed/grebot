
var APIKEY = 'dba9893403730e96386ad1aed850099309b03f59a68569c7b';
const axios = require('axios');
var results;

// Create a full configuration object
// See http://developer.wordnik.com/docs.html

var getDef= async(word)=> {
  // Create a new Client object


  // Start to build the URL
  var wordnikURL = 'http://api.wordnik.com:80/v4/word.json/'+word+'/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key='+APIKEY;




  // Make sure we are asking for JSON
  var args = {headers: {'Accept':'application/json'}};
  response = await axios.get(wordnikURL, {
        headers: {
              'Accept':'application/json'
        }
      })
    //console.log(response.data)
    return response


};


// Finally, actually call the function with the configuration object
//getDef('cathect');
module.exports.getDef = getDef;
