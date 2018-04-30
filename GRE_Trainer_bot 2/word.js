const axios = require('axios');
var value;
require('dotenv').config({ path: 'variables.env'});
var response
var words = async ()=>{
response = await axios.get('https://wordsapiv1.p.mashape.com/words/?letterPattern=^[a-zA-Z]*$&hasDetails=definition%2Cexamples%2Csynonyms&frequencymin=1.8&frequencymax=4&random=true', {
      headers: {
        'X-Mashape-Key': process.env.MashapeKey,
        'X-Mashape-Host': process.env.MashapeHost
      }
    })
  //console.log(response.data)
  return response

    }
// words().then(value =>{
//   console.log(value);
// //  console.log(value.data.results[0].synonyms);
// })


module.exports.words = words
