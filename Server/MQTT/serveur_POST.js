import { createServer } from 'http';

//Pour utilisation de MQTT
import { connect } from 'mqtt';
const mqttBrokerURL = "mqtt://localhost";

//DEBUG ONLY
const lightTopic = 'zigbee2mqtt/0x000b57fffe9c6bfd/set'
//FIN DEBUG

// Fonction pour traiter les requêtes
function handleRequest(req, res) {
    if (req.method === 'POST') {
        let data = '';
        
        // Écouter l'événement 'data' pour collecter les données de la requête
        req.on('data', chunk => {
            data += chunk;
        });

        // Écouter l'événement 'end' pour traiter les données une fois la requête terminée
        req.on('end', () => {
            console.log('Données reçues :', data);
            data = JSON.parse(data);
            console.log('Données JSON :', data);
            
            //Traitement pour prise
            if (data.object != null){
              var topic = data.object;
              console.log("Topic demandéé : "+topic);
              if (data.action == "turnOn"){
                console.log("On allume "+topic);
                var message = '{"state": "ON"}'
                sendMessageToMQTT(topic,JSON.parse(message));
            }else if (data.action == "turnOff"){
                console.log("On éteint "+topic);
                var message = '{"state": "OFF"}'
                sendMessageToMQTT(topic,JSON.parse(message));
           }      
            //Traitement pour demande d'ajout
            }else if (data.commande == "activePairing"){
              //Activation du mode pairing
              console.log("On active le pairing");
              var message = '{"value": true, "time": 20}';
              var topic = "zigbee2mqtt/bridge/request/permit_join";
              sendMessageToMQTT(topic,JSON.parse(message));
              //Ecoute des événéments suivants pour récupérer les informations
              client.subscribe(["zigbee2mqtt/bridge/event"], () => {
                console.log(`Ecoute des événements`)
              })
              client.on('message', (topic, payload) => {
                console.log('Received Message:', topic, payload.toString())
                if (payload.data="definition"){
                  //TODO 
                }
              })              
            }
            
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Données reçues avec succès !');
        });
    } else {
        res.writeHead(405, {'Content-Type': 'text/plain'});
        res.end('Méthode non autorisée. Seules les requêtes POST sont acceptées.');
    }
}

// Création du serveur
const server = createServer(handleRequest);

// Définition du port d'écoute
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
server.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

//Connexion au broquer MQTT
const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4)
let client = connect({
  port: 1883,
  host: "localhost",
  username: "kiurow590",
  password: "zigbee2mqtt",
  clientId: clientId,
  //clean : false,
  keepalive: 60,
  connectTimeout: 30000
});
client.on('connect', () => {
  console.log('Connecté au broker MQTT');
});

//Envoi d'un message à un objet
function sendMessageToMQTT(topic, payload){
    client.publish(topic, JSON.stringify(payload), {}, (err) => {
    if (err) {
      console.error("Erreur lors de l'envoi de la requête:", err);
    } else {
      console.log("La requête a été envoyée avec succès.");
    }
  });
};
