const axios = require('axios');

module.exports = function(RED) {
    function controlLight(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.server = RED.nodes.getNode(config.server);
        this.deviceId = config.deviceId;
        
        node.on('input', async function(msg) {
            
            // API options
            var options = {
                method: 'POST', 
                url: `http://${this.server.host}:${this.server.port}/action/light/${encodeURIComponent(this.deviceId)}`,  // URL API
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    "action": msg.payload
                }
            };
            try {
                // API call with Axios
                const response = await axios(options);
                // Processing API
                msg.payload = response.data;
                node.send(msg);
            } catch (error) {
                //  Error handeling
                node.error(error.message, msg);
            }
        });
        
    }
    
    RED.nodes.registerType("control-light",controlLight);
}