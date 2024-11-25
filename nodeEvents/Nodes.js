function NodesEvents(client) {
    client.lavalink.nodeManager.on('connect', (node) => {
        console.log(`[NODES] -> connected`)
    }).on('disconnect', (node) => {
        console.log(`[NODES] -> disconnect`)
    }).on('reconnecting', (node) => {
        console.log(`[NODES] -> reconnecting`)
    })
}

module.exports = NodesEvents