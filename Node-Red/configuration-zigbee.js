module.exports = function(RED) {
    function configurationZigbee(config) {
        RED.nodes.createNode(this,config);
        this.host = config.host;
        this.port = config.port;
    }
    RED.nodes.registerType("configuration-zigbee",configurationZigbee);
}