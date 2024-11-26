// Function to handle Lavalink player events
function PlayerEvents(client) {
    // Listen to the 'trackStart' event when a track starts playing
    client.lavalink.on('trackStart', (player, track) => {
        // Log the track title when it starts playing
        console.log(`[Track Start] -> ${track?.info?.title}`);
    })
    // Listen to the 'trackEnd' event when a track finishes playing
    .on('trackEnd', (player, track) => {
        // Log the track title when it ends
        console.log(`[Track End] -> ${track?.info?.title}`);
        // Log the current queue length
        console.log(`Queue length after track end: ${player.queue.length}`);
    })
    // Listen to the 'trackError' event when an error occurs with the track
    .on('trackError', (player, track) => {
        // Log the track title when there is an error
        console.log(`[Track Error] -> ${track?.info?.title}`);
        console.error(`Error details: ${track?.error}`);
    })
    // Listen to the 'trackStuck' event when a track is stuck (e.g., if it can't be played properly)
    .on('trackStuck', (player, track) => {
        // Log the track title when the track gets stuck
        console.log(`[Track Stuck] -> ${track?.info?.title}`);
    })
    // Listen to the 'queueEnd' event when the entire queue finishes
    .on('queueEnd', (player, track) => {
        // Log the title of the last track when the queue ends
        console.log(`[Queue Ended] -> ${track?.info?.title}`);
        // Log the queue end event
        console.log('Queue has ended.');
    });
}

// Export the PlayerEvents function to use it elsewhere in the project
module.exports = PlayerEvents;
