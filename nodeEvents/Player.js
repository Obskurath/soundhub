function PlayerEvents(client) {
    client.lavalink.on('trackStart', (player, track) => {
        console.log(`[Track Start] -> ${track?.info?.title}`)
    }).on('trackEnd', (player, track) => {
        console.log(`[Track End] -> ${track?.info?.title}`)
    }).on('trackError', (player, track) => {
        console.log(`[Track Error] -> ${track?.info?.title}`)
    }).on('trackStuck', (player, track) => {
        console.log(`[Track Stuck] -> ${track?.info?.title}`)
    }).on('queueEnd', (player, track) => {
        console.log(`[Queue Ended] -> ${track?.info?.title}`)
    })
}

module.exports = PlayerEvents