const axios = require('axios');

module.exports = function(RED) {
    function fctSwitch(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var msg = {};
        this.server = RED.nodes.getNode(config.server);
        this.sensorId = config.sensorId;

        if (this.server != null){
            // Status management //
            axios.get(`http://${this.server.host}:${this.server.port}/getDetails/${encodeURIComponent(this.sensorId)}`)
            .then(function(response) {
                node.status({fill:"green",shape:"dot",text:"Connected"});
            })
            .catch(function(error) {
                node.status({fill:"red",shape:"dot",text:"Disconnected"});
            });
            
            //Call API to get informations about switch //
            //API options
            var options = {
                method: 'GET', 
                url: `http://${this.server.host}:${this.server.port}/getDetails/${encodeURIComponent(this.sensorId)}`,
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            setInterval(async function(){
                try {            
                    // API call with Axios
                    var response = await axios(options);
                    // Processing API
                    var varName = "lastime"+config.sensorId; 
                    var myFlow = node.context().flow
                    var myTime = response.data.time;
                    var action = "";
                    if (myFlow.get(varName) == null){
                        myFlow.set(varName,myTime);
                        action = response.data.action;
                        msg.payload = action.toUpperCase();
                        node.send(msg);
                    }else if(myFlow.get(varName)!= myTime){
                        action = response.data.action;
                        myFlow.set(varName,myTime);
                        msg.payload = action.toUpperCase();
                        node.send(msg);
                    }
                } catch (error) {
                    node.error(error, msg);
                }
            },500);
        }
    }
    RED.nodes.registerType("zigbee-switch",fctSwitch);
}