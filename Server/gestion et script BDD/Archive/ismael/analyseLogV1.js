const fs = require('fs');
const events = require('events');
const readline = require('readline')

const eventEmitter = new events.EventEmitter();
var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const dossierAEcouter = data.dossierAEcouter

//Acceder au dossier de log
eventEmitter.emit('nouveauDossier');

/*
//Ecouter notre dossier pour voir si un nouveau est cree
fs.watch(dossierAEcouter, (evenement, nomFichier) => {
  if (evenement === 'rename') {
    //Changement observé
    eventEmitter.emit('nouveauDossier')
  }
});*/

//Retrouver le bon dossier
eventEmitter.on('nouveauDossier', () =>{
  // verifié que nous lisons le bon fichier
  console.log("Changement dans le dossier");

  //trouver le nom du bon dossier
  fs.readdir(dossierAEcouter, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Filtrer les dossiers commençant par '2023'
    const matchingDirectories = files.filter(file => fs.statSync(`${directoryPath}/${file}`).isDirectory() && file.startsWith(prefix));

    if (matchingDirectories.length === 0) {
      console.log('Aucun dossier commençant par "2023" trouvé.');
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
})

// Surveillez le fichier pour les modifications !!! ATTENTION AUX CHANGEMENT DU FICHIER !!!
fs.watchFile(JSON.parse(fs.readFileSync('data.json', 'utf8')).fichierLog, (current, previous) => {
  if (current.mtime > previous.mtime) {
    console.log(`Le contenu du fichier a été modifié.`);
    eventEmitter.emit('nouvelleLigne');
  }
});


//Detecter de changement dans le fichier log
eventEmitter.on('nouvelleLigne', () => {
  //lecture de la derniere ligne du fichier de log (en verifiant la taille du fichier)
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
    console.log('Dernière ligne du fichier :', lastLine);
    // Ici on va traiter l'information recu on fait des mises a jour
    let lastLog = JSON.parse(fs.readFileSync('data.json', 'utf8')).lignePrecedente; 
    if(lastLine.includes("MQTT publish: ")){
      const tabLog = lastLine.split("MQTT publish: ");
      if(lastLog != tabLog[1]){
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
              payload: payloadObj
            };
            //Inserer les donnés dans la bdd
            
            //console.log(JSON.stringify(mqttMessage, null, 2)); // Affiche le résultat en format JSON indenté
            var bdd = JSON.parse(fs.readFileSync('bdd1.json', 'utf8'));
          } catch (error) {
            console.error("Erreur lors de l'analyse du payload JSON :", error);
          }
        } else {
          console.error("La chaîne n'est pas au format MQTT publish attendu.");
        }
      }
    }
  });
})

/*
setInterval(() => {
  console.log(data.dossierLog)
}, 2000)
*/