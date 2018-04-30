const GRE_Words = require('./GRE_Words');
var obj = GRE_Words.obj;
var def1 = [];
var def2 = [];
var correct;
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
console.log(obj.length);
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
    def2[0] = obj[def1[0]];
    def2[0].flag = false;
    def2[1] = obj[def1[1]];
    def2[1].flag = false;
    def2[2] = obj[def1[2]];
    def2[2].flag = false;
    def2[3] = obj[def1[3]];
    def2[3].flag = false;
    correct = getRandomInt(4);
    console.log(correct);
    def2[correct].flag = true;
    console.log(def2);
  }

}
}
