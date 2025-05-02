import fs from 'fs';

const updatebddModule = (mqttMessage) =>{
  var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
  const keys = Object.keys(mqttMessage.payload); //Met toute les clés du payload(battery, temp...) dans un tableau
  const idModule = mqttMessage.topic.split('/')[1]; //On récupère l'id di zigbee2mqtt/idModule

  bdd.Module[idModule].time.push(mqttMessage.time); //Ajout de la date et de l'heure

  //On vérifie si le module a déjà été initialisé, si oui alors :
  if (bdd.Module[idModule].init == true){

    for (let i = 0; i < keys.length; i++) { //On parcours toutes les clés du payload et on les ajoutent
      const key = keys[i];
      const value = mqttMessage.payload[key];
      console.log("idModule : " + idModule + "; key : " + key + "; value : " + value)
      //Vérifier si le qui correspond à la key existe pour eviter les erreurs de push, s'il n'existe pas on le crée
        if(bdd.Module[idModule][key] === undefined){
            bdd.Module[idModule][key] = [];
        }
      bdd.Module[idModule][key].push(value);
    }

  }
  //Si le module n'a pas été initialisé alors on l'initialise
  else{
    for (let i = 0; i < keys.length; i++) { //On parcours toutes les clés du payload et on les ajoute
      const key = keys[i];
      const value = mqttMessage.payload[key];
      bdd.Module[idModule][key]=[value];
    }
    bdd.Module[idModule].init=true;
  }
  //Ecriture dans la bdd
  fs.writeFile('../BDD/table_Module.json', JSON.stringify(bdd), function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

const addbddModule = (payload) =>{
  var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
  const idModule = payload.data.friendly_name;
  bdd.Module[idModule] = {
    "init": false,
    "nom": "",
    "time": []
  }
  //Ecriture dans la bdd
  fs.writeFile('../BDD/table_Module.json', JSON.stringify(bdd), function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

const supModule = (id)=>{
  var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
  delete bdd.Module[id];
  fs.writeFile('../BDD/table_Module.json', JSON.stringify(bdd), function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

export default {
  updatebddModule,
  addbddModule,
  supModule
}