const demowink = require('./demowink');
const def = require('./searchwink');
var APIKEY = 'dba9893403730e96386ad1aed850099309b03f59a68569c7b';
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
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

demowink.getRandomWords(config).then
(value =>{
	var def1 = [];
	var def2 = [];
	console.log(value.data);

			def1[0] = value.data[0];
		  def1[0].flag = false;

			def.getDef(value.data[0].word).then(defn => {

				def1[0].definition = defn.data[0].text;
				def1[1] = value.data[1];
        def1[1].flag = false;

				def.getDef(value.data[1].word).then(defn => {

					def1[1].definition = defn.data[0].text;
					def1[2] = value.data[2];
          def1[2].flag = false;

					def.getDef(value.data[2].word).then(defn => {

            def1[2].definition = defn.data[0].text;
						def1[3] = value.data[3];
            def1[3].flag = false;
						def.getDef(value.data[3].word).then(defn => {

							def1[3].definition = defn.data[0].text;
							//console.log(def1);
              correct = getRandomInt(4);
              console.log(correct);
              def1[correct].flag = true;
              console.log(def1[correct].word);
              console.log(def1);

						})

					})

				})
			})
})
