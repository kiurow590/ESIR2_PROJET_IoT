var fs = require('fs');
var test = JSON.parse(fs.readFileSync('bdd1.json', 'utf8'));

/*
console.log(test);
test.homeTown = "New York";
console.log(test);
test.members[0].powers.push("Invisibility");*/


console.log(test);

test.ModuleReceiver.Module3 = 
{
    "Nom": "Mod3",
    "ListeEtat": {
      "val1": "12",
      "val2": "12"
    },
    "ListeHoraire": {
      "hor1": "12h20",
      "hor2": "13h30"
    }
  };


fs.writeFile('bdd1.json', JSON.stringify(test), function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});