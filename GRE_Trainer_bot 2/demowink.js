
var APIKEY = 'dba9893403730e96386ad1aed850099309b03f59a68569c7b';

var def = require('./searchwink');
const axios = require('axios');

var config = {
	hasDictionaryDef: true,
	includePartOfSpeech: "verb-transitive",
	minCorpusCount: 0,
	maxCorpusCount: 50,
	minDictionaryCount: 1,
	maxDictionaryCount: -1,
	minLength: 5,
	maxLength: -1,
	limit: 4,
	api_key: APIKEY
};

var getRandomWords = async (config)=>{


  // Start to build the URL
  var wordnikURL = 'http://api.wordnik.com/v4/words.json/randomWords?';

  // Parse the configuraiton object and create the request URL
  for(var option in config) {
  	wordnikURL = wordnikURL + "&" + option + "=" + config[option];
  }

  // Make sure we are asking for JSON
  var args = {headers: {'Accept':'application/json'}};
	response = await axios.get(wordnikURL, {
	      headers: {
	        'Accept':'application/json'
	      }
	    })
	 // console.log(response.data)
	  return response



};


module.exports.getRandomWords = getRandomWords;
