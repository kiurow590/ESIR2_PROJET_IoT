import express from 'express'
import cors from 'cors';
import fs from "fs";
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var jsonParser = bodyParser.json()



//Pour utilisation de MQTT
import { connect } from 'mqtt';
const mqttBrokerURL = "mqtt://localhost";

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

//Envoi d'un message à un objet
function sendMessageToMQTT(topic, payload){
  console.log("Tentative d'enoi du message "+payload);
  client.publish(topic, JSON.stringify(payload), {}, (err) => {
  if (err) {
    console.error("Erreur lors de l'envoi de la requête:", err);
  } else {
    console.log("La requête a été envoyée avec succès.");
  }
});
};

client.on('connect', () => {
  console.log('Connecté au broker MQTT');
});


app.use(cors({
    origin: 'http://localhost:3005',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization',
}));

app.listen(3005, () => {
    console.log("Serveur à l'écoute")
});

app.post('/allowAddDevice', (req, res) => {
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
        //TODO renvoyer au gront le device ajouté et l'intégrer dans une base de données quelquonque
      }
 
    res.status(200).json("OK")
    })
});

app.post('/action/plug/:id', jsonParser, (req, res) => {
    //Changmeent état prise
    //data = JSON.parse(req.body);
    console.log(req.body);
    var data = req.body.action;
    var id = req.params.id;
    var topic = "zigbee2mqtt/"+ id+"/set";
    console.log("Topic demandéé : "+topic);
    console.log("Action demandéé : "+data);
    if (data == "ON"){
        console.log("On allume "+topic);
        var message = '{"state": "ON"}'
        sendMessageToMQTT(topic,JSON.parse(message));
    }else if (data == "OFF"){
        console.log("On éteint "+topic);
        var message = '{"state": "OFF"}'
        sendMessageToMQTT(topic,JSON.parse(message));
    }else if (data == "TOGGLE"){
        console.log("On éteint "+topic);
        var message = '{"state": "TOGGLE"}'
        sendMessageToMQTT(topic,JSON.parse(message));
    }     
    res.status(200).json("OK")
    });
    
// erreur 404
app.use((req, res) => {
    console.log("\n Error 404")
    res.status(404).json("Aie");
});




