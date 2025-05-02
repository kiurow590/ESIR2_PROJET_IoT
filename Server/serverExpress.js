import express from 'express'
import cors from 'cors';
import fs from "fs";
import bodyParser from 'body-parser'
import constantUnit from './constantUnit.mjs'

const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
var jsonParser = bodyParser.json()

//Pour utilisation de MQTT
import { connect } from 'mqtt';
import { time } from 'console';
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
function sendMessageToMQTT(topic, payload) {
    console.log("Tentative d'enoi du message " + payload);
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
    origin: 'http://rpi-esir2iot.esir.univ-rennes1.fr:5173',
    methods: 'GET,POST, DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));

app.listen(8090, () => {
    console.log("Serveur à l'écoute")
})

app.post('/writeName/:id', (req, res) => {
    const id = req.params.id;
    res.status(200).json("coucou : " + id);
});

app.get('/listDevice', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        var result = []
        for (let key in bddModule.Module) {
            var element = {}
            let taille_tab = bddModule.Module[key].time.length - 1;
            element["deviceId"] = key
            element["deviceName"] = bddModule.Module[key].nom
            element["deviceStatus"] = "ON"
            element["info"] = {}
            for (const k in bddModule.Module[key]) {
                //element["info"][k] = bddModule.Module[key][k][-1];
                if (k !== "init" && k !== "nom") {
                    element["info"][k] = bddModule.Module[key][k][taille_tab];
                }
            }
            result.push(element)
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(404).json("Echec de la récuperation des modules");
    }
});

//http://localhost:8090/getStateV1/0x00124b00226717d1
app.get('/getState/:id', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        const id = req.params.id;
        let taille_tab = bddModule.Module[id].time.length - 1;
        let module = bddModule.Module[id];
        res.status(200).json({
            //heure : module.time[taille_tab],
            //battery : module.battery[taille_tab]
            deviceId: id,
            deviceStatus: "connected or no connected",
            return: "Ok"
        });
    } catch (error) {
        res.status(404).json("ID manquant dans l'URL ou ID non trouvé dans la BDD");
    }
});

app.get('/getDetails/:id', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        const id = req.params.id;
        let taille_tab = bddModule.Module[id].time.length - 1;
        let module = bddModule.Module[id];
        let param = {};

        //parcourir l'ensemble des clés de module
        for (const key in module) {
            if (module.hasOwnProperty(key)) {
                const element = module[key];
                param[key] = element[taille_tab]; //Affche le dernier élément enregistré
            }
        }

        param["deviceId"] = id;
        param["deviceStatus"] = "connected or no connected";
        param["return"] = "Ok";

        res.status(200).json(param);
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

app.get('/listDevice/details', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        let param = {};
        for (let id in bddModule.Module) {
            param[id] = {};
            param[id]["deviceName"] = bddModule.Module[id].nom;
            param[id]["deviceStatus"] = "connected or no connected";
            param[id]["deviceTime"] = bddModule.Module[id].time;

            var module = bddModule.Module[id];
            for (const key in module) {
                if (module.hasOwnProperty(key)) {
                    // Exclude the fields you don't want
                    if (key !== "nom" && key !== "init" && key !== "time" && key !== "linkquality" && key !== "voltage" && key !== "battery_low" && key !== "tamper") {
                        param[id][key] = module[key];
                        while (param[id][key].length < 30) {
                            param[id][key].unshift(0);
                        }
                        // const element = module[key];
                        // param[key] = element[taille_tab]; //Affche le dernier élément enregistré
                    }
                }
            }
        }
        res.status(200).json(param);
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

app.get('/device/:id/data', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        let param = {};
        const id = req.params.id;
        // for (let id in bddModule.Module){
        param[id] = {};
        param[id]["deviceTime"] = bddModule.Module[id].time;
        param[id]["unit"] = [];
        param[id]["name"] = [];


        //remplace l'espace de la date par un "T" pour que la date soit reconnue par le graphique
        for (let i = 0; i < param[id]["deviceTime"].length; i++) {
            param[id]["deviceTime"][i] = param[id]["deviceTime"][i].replace(" ", "T");
        }

        param[id]["valueGraph"] = [];
        console.log("--------------------1--------------------" + "\n");
        console.log(param);
        //var id_tab = 0;
        var module = bddModule.Module[id];
        for (const key in module) {
            if (module.hasOwnProperty(key)) {
                // Exclude the fields you don't want
                if (key !== "nom" && key !== "init" && key !== "time" && key !== "linkquality" && key !== "voltage" && key !== "battery_low" && key !== "tamper" && key !== "battery") {
                    //param[id]["valueGraph"][id_tab] = [];
                    // console.log("--------------------2--------------------" + "\n");
                    // console.log(param);
                    param[id]["unit"].push(constantUnit[key]);
                    param[id]["name"].push(key);

                    var tabValKey = module[key];
                    while (tabValKey.length < 30) {
                        tabValKey.unshift(0);
                    }
                    //param[id]["valueGraph"].push([]);
                    var tmpVal = [];
                    for (let i = 0; i < tabValKey.length; i++) {
                        tmpVal.push({ x: new Date(`${param[id]["deviceTime"][i]}`), y: tabValKey[i] });
                        //tmpVal.push({x: "1", y: "2"});
                    }
                    param[id]["valueGraph"].push(tmpVal);
                    console.log("--------------------3--------------------" + "\n" + param);
                    console.log(param);
                    console.log(tmpVal);

                }
            }
            //id_tab++;
        }


        //}
        res.status(200).json(param);
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

app.delete('/delete/:id', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        //Delete du JSON
        const id = req.params.id;
        let taille_tab = bddModule.Module[id].time.length - 1;
        console.log(delete bddModule.Module[id]);
        fs.writeFile('./BDD/table_Module.json', JSON.stringify(bddModule), function (err) {
            if (err) throw err;
            console.log('It\'s saved!');

            //DElete du MQTT
            var message = `{"id":"${id}","force":true}`;
            var topic = "zigbee2mqtt/bridge/request/device/remove";
            sendMessageToMQTT(topic, JSON.parse(message));
            //Ecoute des événéments suivants pour récupérer les informations
            client.subscribe(["zigbee2mqtt/bridge/event"], () => {
                console.log(`Ecoute des événements`)
            })
            client.on('message', (topic, payload) => {
                console.log('Received Message:', topic, payload.toString())
            })

        });
        res.status(200).json("OK");
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

// BUG : si il y a un '/' dans le nom, La requête ne fonctionne pas !
app.get('/writeName/:name/:id', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        const id = req.params.id;
        bddModule.Module[id].nom = req.params.name;
        //Ecriture dans la bdd
        fs.writeFile('./BDD/table_Module.json', JSON.stringify(bddModule), function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
        });
        res.status(200).json("ok");
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

app.get('/search/:id', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        const str = req.params.id;
        var name = "";
        var distName = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] !== bddModule.Module["0x00124b00226717d1"].nom[i]) {
                distName++;
            }
        }
        let param = {};
        for (let id in bddModule.Module) {
            //distance de haming entre le str et le nom du module
            let distance = 0;
            for (let i = 0; i < str.length; i++) {
                if (str[i] !== bddModule.Module[id].nom[i]) {
                    distance++;
                }
            }
            if (distance <= distName) {
                distName = distance;
                name = bddModule.Module[id].nom;
            }
        }
        param["module find"] = name;
        res.status(200).json(param);
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

app.get('/searchList/:id', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        const str = req.params.id;
        var name = "";
        var distName = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] !== bddModule.Module["0x00124b00226717d1"].nom[i]) {
                distName++;
            }
        }
        let param = {};
        param["list_module_fin"] = [];
        for (let id in bddModule.Module) {
            //distance de haming entre le str et le nom du module
            let distance = 0;
            var idem = true;
            for (let i = 0; i < str.length; i++) {
                if (str[i] !== bddModule.Module[id].nom[i]) {
                    idem = false;
                }
            }
            if (idem === true) {
                param["list_module_fin"].push(bddModule.Module[id].nom);
            }
        }

        res.status(200).json(param);
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

app.post('/allowAddDevice', (req, res) => {
    //-------------------------------------------------Code factise pour test-------------------------------------------------
    // let factise = [
    //     {id: "0x00124b00226717d1", name: "SNZB-02 - SONOFF Temperature and humidity sensor (EndDevice)"},
    //     {id: "0x00124b0022ebe9ce", name: "SNZB-03 - SONOFF Motion sensor (EndDevice)"}
    // ];
    // res.status(200).json(factise);
    //-------------------------------------------------Code factise pour test-------------------------------------------------

    //-------------------------------------------------Code en commentaire fonctionnel normalement-------------------------------------------------
    // Activation du mode pairing
    console.log("On active le pairing");
    var message = '{"value": true, "time": 240}';
    var topic = "zigbee2mqtt/bridge/request/permit_join";
    sendMessageToMQTT(topic, JSON.parse(message));
    //Ecoute des événéments suivants pour récupérer les informations
    client.subscribe(["zigbee2mqtt/bridge/event"], () => {
        console.log(`Ecoute des événements`)
    })
    client.on('message', (topic, payload) => {
        console.log('Received Message:', 'topic : ', topic, 'payload : ', payload.toString())
        payload = JSON.parse(payload)
        if (payload && payload.data && payload.data.definition && payload.data.definition.hasOwnProperty('model')) {

            let friendly_name = payload.data.friendly_name;
            let description = payload.data.definition.description;
            let model = payload.data.definition.model;

            console.log('friendly_name XXX:', friendly_name);
            console.log('description XXX:', description);
            console.log('model XXX:', model);

            //var bdd = JSON.parse(fs.readFileSync('BDD/table_nom.json', 'utf8'));
            //mettre le fs.readFile dans un try catch
            try {
                fs.readFile('BDD/table_Module.json', 'utf8', (err, data) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    if (data === '') {
                        console.log('Le fichier est vide');
                    } else {
                        let jsonData = JSON.parse(data);
                        // Utilisez jsonData...
                        console.log("bdd avant ajout : ")
                        console.log(jsonData)


                        // jsonData.Module[friendly_name] = {
                        //     "nom": description,
                        // }

                        jsonData.Module[friendly_name].nom = description

                        console.log("bdd après ajout : ")
                        console.log(jsonData)
                        fs.writeFile('BDD/table_Module.json', JSON.stringify(jsonData), function (err) {
                            if (err) throw err;
                            console.log('It\'s saved!');
                        });

                        //arrêter le subscribe
                        client.unsubscribe(["zigbee2mqtt/bridge/event"], () => {
                            console.log(`Désactivation de l'écoute des événements`)
                        })
                    }
                });

            } catch (error) {
                console.error(error);
            }


        }

        // if (payload.data.hasOwnProperty("definition")){
        //TODO renvoyer au gront le device ajouté et l'intégrer dans une base de données quelquonque + La requete doit etre de type POST !!
        // }
        //envoyer le fichier device_find.json une foie qu'il existe
        //import path from 'path';
        // try{
        //         const filePath = "./BDD/device_find.json";

        //         // Attendre que le fichier apparaisse

        //         //A décommenter pb avec l'analyse log, le fichier n'apparait jamais
        //         // while (!fs.existsSync(filePath)) {
        //         //     // Attendre 1 seconde avant de vérifier à nouveau
        //         //     setTimeout(() => {}, 1000);
        //         // }

        //         // Lire et envoyer le contenu du fichier
        //         fs.readFile(filePath, 'utf8', (err, data) => {
        //             if (err) {
        //                 console.error(err);
        //                 res.status(500).json({ message: 'Erreur lors de la lecture du fichier' });
        //             } else {
        //                 res.status(200).json(JSON.parse(data));
        //                 //supprimer le fichier
        //                 fs.unlink(filePath, (err) => {
        //                     if (err) {
        //                         console.error(err);
        //                     } else {
        //                         console.log('Fichier supprimé');
        //                     }
        //                 });
        //             }
        //         });
        //     }catch(error){
        //         console.error(error)
        //     }
    })
    setTimeout(() => { res.status(200).json("OK"); }, 20000)

    //-------------------------------------------------Code en commentaire fonctionnel-------------------------------------------------
});

app.post('/action/plug/:id', jsonParser, (req, res) => {
    //Changement état prise
    //data = JSON.parse(req.body);
    console.log(req.body);
    var data = req.body.action;
    var id = req.params.id;
    var topic = "zigbee2mqtt/" + id + "/set";
    console.log("Topic demandéé : " + topic);
    console.log("Action demandéé : " + data);
    if (data == "ON") {
        console.log("On allume " + topic);
        var message = '{"state": "ON"}'
        sendMessageToMQTT(topic, JSON.parse(message));
    } else if (data == "OFF") {
        console.log("On éteint " + topic);
        var message = '{"state": "OFF"}'
        sendMessageToMQTT(topic, JSON.parse(message));
    } else if (data == "TOGGLE") {
        console.log("On éteint " + topic);
        var message = '{"state": "TOGGLE"}'
        sendMessageToMQTT(topic, JSON.parse(message));
    }
    res.status(200).json("OK")
});

app.post('/action/light/:id', jsonParser, (req, res) => {
    //Changement état lampe
    //data = JSON.parse(req.body);
    console.log(req.body);
    var data = req.body.action;
    var id = req.params.id;
    var topic = "zigbee2mqtt/" + id + "/set";
    console.log("Topic demandéé : " + topic);
    console.log("Action demandéé : " + data);
    if (data == "ON") {
        console.log("On allume " + topic);
        var message = '{"state": "ON"}'
        sendMessageToMQTT(topic, JSON.parse(message));
    } else if (data == "OFF") {
        console.log("On éteint " + topic);
        var message = '{"state": "OFF"}'
        sendMessageToMQTT(topic, JSON.parse(message));
    } else if (data == "TOGGLE") {
        console.log("On éteint " + topic);
        var message = '{"state": "TOGGLE"}'
        sendMessageToMQTT(topic, JSON.parse(message));
    }
    res.status(200).json("OK")
});

app.get('/listDeviceType', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_Module.json', 'utf8'));
    try {
        var result = {}
        var type = []
        for (let key in bddModule.Module) {
            var element = {}
            let taille_tab = bddModule.Module[key].time.length - 1;
            element["deviceId"] = key
            element["deviceName"] = bddModule.Module[key].nom
            element["deviceStatus"] = "ON"
            element["info"] = {}
            for (const k in bddModule.Module[key]) {
                //element["info"][k] = bddModule.Module[key][k][-1];
                if (k !== "init" && k !== "nom") {
                    element["info"][k] = bddModule.Module[key][k][taille_tab];
                    //console.log(k+"!!!!!!!!!!!!")
                    //console.log(element.info)
                    if (!type.includes(k)) {
                        type.push(k)
                    }
                }
            }
            for (let typ in type) {
                if (type[typ] !== "nom" && type[typ] !== "init" && type[typ] !== "time" && type[typ] !== "linkquality" && type[typ] !== "voltage" && type[typ] !== "battery_low" && type[typ] !== "tamper" && type[typ] !== "battery") {
                    // result.push(type)
                    let ty = type[typ]
                    if (!result.hasOwnProperty(type[typ])) {
                        //result.push(type[typ])
                        result[ty] = {}
                        //console.log(result + "!!!!!!!!!!")
                    }
                    if (bddModule.Module[key].hasOwnProperty(type[typ])) {
                        //result.push(element)
                        result[ty][key] = element
                    }
                }
            }
        }


        res.status(200).json(result);
        // res.status(200).json(result);
        //  res.write.json('Premiere partie de la reponse\n');
        //
        //  // Créer une promesse qui résout après un certain délai
        //  let myPromise = new Promise((resolve, reject) => {
        //      // Simuler un processus en arrière-plan avec un délai
        //      setTimeout(() => {
        //          resolve('Deuxieme partie de la reponse\n');
        //      }, 5000); // Attendre 5 secondes
        //  });
        //
        //  // Attendre que la promesse soit résolue, puis envoyer la deuxième partie de la réponse
        //  myPromise.then((value) => {
        //      res.write.json(value);
        //      res.end();
        //  });

    } catch (error) {
        res.status(404).json("Echec de la récuperation des modules");
    }
});

app.get('/askPermission/:password', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_User.json', 'utf8'));
    try {
        const str = req.params.password;
        var password = bddModule.admin.mdp;
        if (password === str) {
            res.status(200).json("true");
        }
        else {
            res.status(200).json("false");
        }
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});

app.get('/changePassword/:password', (req, res) => {
    var bddModule = JSON.parse(fs.readFileSync('./BDD/table_User.json', 'utf8'));
    try {
        const newPassword = req.params.password;
        bddModule.admin.mdp = newPassword;
        fs.writeFile('./BDD/table_User.json', JSON.stringify(bddModule), function (err) {
            if (err) throw err;
            console.log('It\'s saved!');
        });
        res.status(200).json("OK");
    } catch (error) {
        res.status(404).json({ return: "ERROR : ID manquant dans l'URL ou ID non trouvé dans la BDD" });
    }
});


// erreur 404
app.use((req, res) => {
    console.log("\n Error 404")
    res.status(404).json("Aie");
});