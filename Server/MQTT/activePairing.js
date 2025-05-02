import { connect } from 'mqtt';

// URL du broker MQTT sur votre serveur
const mqttBrokerURL = "mqtt://localhost:1883";

// Sujet MQTT pour la requête de permit_join
const permitJoinTopic = 'zigbee2mqtt/bridge/request/permit_join';

// Données de la requête pour permettre la connexion de nouveaux dispositifs
const payload = { value: true };

const clientId = 'mqttjs_' + Math.random().toString(8).substr(2, 4)

// Connexion au broker MQTT
const client = connect(mqttBrokerURL, {
    "username": "kiurow590",
    "password": "zigbee2mqtt",
    "clientId": clientId,
    "clean" : false,
})

client.on('connect', () => {
    console.log('Connecté au broker MQTT');

    // Envoi de la requête permit_join
    client.publish(permitJoinTopic, function (err) {
        if (err) {
            console.error("Erreur lors de la souscription:", err);
        } else {
            console.log("Souscription réussie au sujet:", zigbeeEventsTopic);
        }
    });
});




client.on('error', function (err) {
    console.log('Error: ' + err)
    if (err.code == 'ENOTFOUND') {
        console.log(
            'Network error, make sure you have an active internet connection'
        )
    }
})

client.on('close', function (err) {
    console.log('Connection closed by client, Erreur : ', err)
})

client.on('reconnect', function () {
    console.log('Client trying a reconnection')
})

client.on('offline', function () {
    console.log('Client is currently offline')
})

client.on('error', (error) => {
    console.error('Erreur MQTT:', error);
});
