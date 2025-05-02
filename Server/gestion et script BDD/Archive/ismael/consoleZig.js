const fs = require('fs');
const event = require('events')

const eventEmitter = new event.EventEmitter();
const dossierAEcouter = '/opt/zigbee2mqtt/data/log/'; 
/*
fs.watch(dossierAEcouter, (evenement, nomFichier) => {
  if (evenement === 'rename') {
    console.log(`Nouveau dossier créé : ${nomFichier}`);
  }
});

const cheminDuFichier = 'chemin/vers/le/fichier.txt'; // Remplacez ceci par le chemin du fichier que vous souhaitez surveiller

// Surveillez le fichier pour les modifications
fs.watchFile(cheminDuFichier, (current, previous) => {
  if (current.mtime > previous.mtime) {
    console.log(`Le contenu du fichier ${cheminDuFichier} a été modifié.`);
  }
});

eventEmitter.on('nouveauDossier', () =>{
  // verifié que nous lisons le bon fichier
  console.log("Nouveau dossier crée");
})

eventEmitter.on('nouvelleLigne', () => {
  //lecture de la derniere ligne du fichier de log (en verifiant la taille du fichier)

})
*/


function readLogFile(directoryPath, prefix){
  let chemin = 'test';
  //const directoryPath = '/opt/zigbee2mqtt/data/log/'; //A revoir: si le dossier opt n'est pas a la racine
  //const prefix = '2023';

  fs.readdir(directoryPath, (err, files) => {
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
      chemin = dernierDossier;
      console.log('Nom complet du dernier dossier commençant par "2023" :', chemin);
      
      return chemin
    }
  });
  //return chemin;
}



const directoryPath = '../'; //A revoir: si le dossier opt n'est pas a la racine
const prefix = '2023';
readLogFile(directoryPath, prefix)



/*
setInterval(() => {
  readLogFile();
}, 200)
*/