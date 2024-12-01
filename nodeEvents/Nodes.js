// Function to handle Lavalink node events
function NodesEvents(client) {
    // Listen to the 'connect' event when a node connects to Lavalink
    client.lavalink.nodeManager.on('connect', (node) => {
        // Log a message when a node is successfully connected
        console.log(`[NODES] -> Connected`);
    })
    // Listen to the 'disconnect' event when a node disconnects from Lavalink
    .on('disconnect', (node) => {
        // Log a message when a node is disconnected
        console.log(`[NODES] -> Disconnect`);
    })
    // Listen to the 'reconnecting' event when a node is attempting to reconnect
    .on('reconnecting', (node) => {
        // Log a message when a node is attempting to reconnect
        console.log(`[NODES] -> Reconnecting`);
    })
}

// Export the NodesEvents function to use it elsewhere in the project
module.exports = NodesEvents;
