import fs from 'fs';
import events from 'events';
import readline from 'readline';


const eventEmitter = new events.EventEmitter();
const eventEmitterId = new events.EventEmitter();

const filePath = "/var/log/zigbee2mqtt/log.txt";
import fonction_MQTT from './fonction_MQTT.mjs'

//var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));


//Retrouver le bon dossier
/*
//trouver le nom du bon dossier
fs.readdir(dossierAEcouter, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  // Filtrer les dossiers commençant par '2023'
  const matchingDirectories = files.filter(file => fs.statSync(`${directoryPath}/${file}`).isDirectory());

  if (matchingDirectories.length === 0) {
    console.log('Aucun dossier trouvé.');
  } else {
    // Trier les dossiers par ordre alphabétique
    matchingDirectories.sort();
    // Récupérer le nom du dernier dossier
    const dernierDossier = matchingDirectories[matchingDirectories.length - 1];
    console.log('Nom complet du dernier dossier commençant par "2023" :', dernierDossier);

    //mettre a jour mon fichier (dossier trouvé)
    data.fichierLog = dernierDossier+"/log.txt"; // a modifier pour le test
    fs.writeFile('data.json', JSON.stringify(data), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
    eventEmitter.emit('nouvelleLigne');
  }
});
*/

console.log("Started ...");

// Surveillez le fichier pour les modifications
fs.watchFile(filePath, (current, previous) => {
  if (current.mtime > previous.mtime) {
    console.log(`Le contenu du fichier a été modifié.`);
    eventEmitter.emit('nouvelleLigne');
  }
});


//Detecter de changement dans le fichier log
eventEmitter.on('nouvelleLigne', () => {
  //lecture de la derniere ligne du fichier de log (en verifiant la taille du fichier)
  //const filePath = filePath;
  const fileStream = fs.createReadStream(filePath); //filePath c'est le fichier log.txt
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lastLine = '';

  rl.on('line', (line) => {
    lastLine = line;
  });

  rl.on('close', () => {
    console.log('Dernière ligne du fichier :', lastLine);
    // Ici on va traiter l'information recu on fait des mises a jour
    //let lastLog = JSON.parse(fs.readFileSync('data.json', 'utf8')).lignePrecedente;

    //Gestion d'ajout de donnée et de nouveu module
    if (lastLine.includes("MQTT publish: ")) {
      const tabLog = lastLine.split("MQTT publish: ");

      //gestion de la date et des heures de logs
      const date = tabLog[0].split(" ")[2];
      const heure = tabLog[0].split(" ")[3];
      let dateHeure = date + " " + heure;
      dateHeure = dateHeure.slice(0,-1);


      // Sépare le sujet (topic) et le payload à l'aide de l'expression régulière
      const regex = /topic '(.+)', payload '(.+)'/;
      const matches = tabLog[1].match(regex);

      if (matches && matches.length === 3) {
        const topic = matches[1];
        const payloadStr = matches[2];

        try {
          // Transforme la chaîne JSON du payload en un objet JavaScript
          const payloadObj = JSON.parse(payloadStr);

          // Crée un objet JSON avec le sujet et le payload
          const mqttMessage = {
            topic: topic,
            payload: payloadObj,
            time: dateHeure
          };
          console.log(JSON.stringify(mqttMessage, null, 2)); // Affiche le résultat en format JSON indenté

          //Inserer les donnés dans la bdd
          var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
          var idModule = topic.split('/')[1];

          //vérife que l'idModule du topic existe (topic == zigbee2mqtt/idModule)
          var idExistant = false
          for (let i in bdd.Module) {
            if (i == idModule) {
              idExistant = true;
            }
          }

          if (topic == "zigbee2mqtt/bridge/event") {
            console.log("creation de module")
            fonction_MQTT.addbddModule(payloadObj);
          } else if (topic == "zigbee2mqtt/" + idModule) {
            console.log("Update de module")
            fonction_MQTT.updatebddModule(mqttMessage);
          }


        } catch (error) {
          console.error("Erreur lors de l'analyse du payload JSON :", error);
        }
      } else {
        console.error("La chaîne n'est pas au format MQTT publish attendu.");
      }

    }
      else if (lastLine.includes("joined")) {
      //Attend les prochaines lignes, jusqu'à ce que le message "Zigbee: disabling joining new devices." soit trouvé
      //On écoute le fichier
      console.log("Nouveau module")
      let tabId = [];
      let tabName = [];

      // Surveillez le fichier pour les modifications
      fs.watchFile(filePath, (current, previous) => {
        if (current.mtime > previous.mtime) {
          console.log(`Le contenu du fichier a été modifié.`);
          eventEmitterId.emit('nouvelleLigne');
        }
      });

      eventEmitterId.on('nouvelleLigne', () => {
        const filePath = filePath;
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
          input: fileStream,
          crlfDelay: Infinity,
        });

        let lastLine = '';

        rl.on('line', (line) => {
          lastLine = line;
        });
        rl.on('close', () => {
          console.log(lastLine);
          if (lastLine.includes("Zigbee: disabling joining new devices.")) {
            console.log("Fin de la recherche");
            //enregistrer les informtions dans un fichier json, de la forme {id: nom}
            let tab = [];
            for (let i = 0; i < tabId.length; i++) {
              tab.push({ id: tabId[i], name: tabName[i] });
            }
            fs.writeFile('./BDD/device_find.json', JSON.stringify(tab), function (err) {
              if (err) throw err;
              console.log('BDD Device_find.json It\'s saved!');
            });
            rl.close();
            eventEmitterId.removeAllListeners('nouvelleLigne')
            //fermer cette eventListener
            //eventEmitter.off('nouvelleLigne');
          } else {
            console.log("Line : " + lastLine);
            const idComplete = lastLine.split(":")[3];
            const id = idComplete.split(" ")[1];
            const name = lastLine.split(":")[4];
            console.log("tabLog : " + id);
            //const id_ap = tabLog[1].split(" ")[1];
            //const id = id_ap.slice(1, -1);
            tabId.push(id);
            tabName.push(name);
            console.log(tabId);
            console.log(tabName);
          }
        });
      });

     }
    // else if (lastLine.includes("is supported, identified as:")) {
    //   // ligne à traiter : info  2024-04-16 15:37:00: Device '0x00124b00226717d1' is supported, identified as: SONOFF Temperature and humidity sensor (SNZB-02)
    //   const id_ap = lastLine.split("Device '")[1];
    //   const id = id_ap.split("'")[0];
    //   const name = lastLine.split("identified as: ")[1];
    //   console.log("id : " + id + " name : " + name);
    
    //   // var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
    //   // bdd.Module[id].nom = name
    //   // fs.writeFile('../BDD/table_Module.json', JSON.stringify(bdd), function (err) {
    //   //   if (err) throw err;
    //   //   console.log('It\'s saved!');
    //   // });


    //   //fonction_MQTT.addbddModule({ data: { friendly_name: id, name: name } });
    // }
    else if (lastLine.includes("Removing device")) {
      const tabLog = lastLine.split("Removing device ");
      const id_ap = tabLog[1].split(" ")[0];
      const id = id_ap.slice(1, -1);
      //   for (let i = 1; i < id_ap.length-1; i++) {
      //     id += id_ap[i];
      //   }

      fonction_MQTT.supModule(id);
    }
  });
})


//Mise a jour des donnees dans la bdd (il pourrait s'agir de la la partie RECEIVER )
// function updatebddModule(mqttMessage){
//   var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
//   const keys = Object.keys(mqttMessage.payload); //Met toute les clés du payload(battery, temp...) dans un tableau
//   const idModule = mqttMessage.topic.split('/')[1]; //On récupère l'id di zigbee2mqtt/idModule
//
//   bdd.Module[idModule].time.push(mqttMessage.time); //Ajout de la date et de l'heure
//
//   //On vérifie si le module a déjà été initialisé, si oui alors :
//   if (bdd.Module[idModule].init == true){
//
//     for (let i = 0; i < keys.length; i++) { //On parcours toutes les clés du payload et on les ajoutent
//       const key = keys[i];
//       const value = mqttMessage.payload[key];
//       bdd.Module[idModule][key].push(value);
//     }
//
//   }
//   //Si le module n'a pas été initialisé alors on l'initialise
//   else{
//     for (let i = 0; i < keys.length; i++) { //On parcours toutes les clés du payload et on les ajoutent
//       const key = keys[i];
//       const value = mqttMessage.payload[key];
//       bdd.Module[idModule][key]=[value];
//     }
//     bdd.Module[idModule].init=true;
//   }
//   //Ecriture dans la bdd
//   fs.writeFile('../BDD/table_Module.json', JSON.stringify(bdd), function (err) {
//     if (err) throw err;
//     console.log('It\'s saved!');
//   });
// }

//Creation de nouveau module
// function addbddModule(payload){
//   var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
//   const idModule = payload.data.friendly_name;
//   bdd.Module[idModule] = {
//     "init": false,
//     "nom": "",
//     "time": []
//   }
//   //Ecriture dans la bdd
//   fs.writeFile('../BDD/table_Module.json', JSON.stringify(bdd), function (err) {
//     if (err) throw err;
//     console.log('It\'s saved!');
//   });
// }

// function supModule(id){
//     var bdd = JSON.parse(fs.readFileSync('../BDD/table_Module.json', 'utf8'));
//     delete bdd.Module[id];
//     fs.writeFile('../BDD/table_Module.json', JSON.stringify(bdd), function (err) {
//         if (err) throw err;
//         console.log('It\'s saved!');
//     });
// }