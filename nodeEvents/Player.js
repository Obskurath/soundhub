function PlayerEvents(client) {
    client.lavalink.on('trackStart', (player, track) => {
        console.log(`[Track Start] -> ${track?.info?.title}`);
    }).on('trackEnd', (player, track) => {
        console.log(`[Track End] -> ${track?.info?.title}`);
        // Log the current queue length
        console.log(`Queue length after track end: ${player.queue.length}`);
    }).on('trackError', (player, track) => {
        console.log(`[Track Error] -> ${track?.info?.title}`);
        console.error(`Error details: ${track?.error}`);
    }).on('trackStuck', (player, track) => {
        console.log(`[Track Stuck] -> ${track?.info?.title}`);
    }).on('queueEnd', (player, track) => {
        console.log(`[Queue Ended] -> ${track?.info?.title}`);
        // Log the queue end event
        console.log('Queue has ended.');
    });
}

module.exports = PlayerEvents;