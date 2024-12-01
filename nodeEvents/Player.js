const { createNowPlaying } = require('../utils/embeds/play/createNowPlaying');
const { createNowPlayingImage, getAverageColor } = require('../utils/canvasHelper');
const { AttachmentBuilder } = require('discord.js');
const { loadImage } = require('canvas');

function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function PlayerEvents(client) {
    client.lavalink.on('trackStart', async (player, track) => {
        console.log(`[Track Start] -> ${track?.info?.title} -> Guilds ${player.guildId} -> Volume ${player.volume}%`);

        const currentTrack = player.queue.current;
        if (!currentTrack) return;

        // Create canvas image
        const buffer = await createNowPlayingImage(currentTrack);

        // Create attachment
        const attachment = new AttachmentBuilder(buffer, { name: 'now-playing.png' });

        // Embed Color
        const thumbnailUrl = currentTrack.info.artworkUrl || 'https://example.com/default-thumbnail.png';
        const thumbnail = await loadImage(thumbnailUrl);
        const glowColor = await getAverageColor(thumbnail);
        const hexColor = rgbToHex(glowColor);

        const { embed, components } = createNowPlaying(currentTrack, player, hexColor, attachment);

        const channel = client.channels.cache.get(player.textChannelId);
        if (channel) {
            await channel.send({ embeds: [embed], components, files: [attachment] });
        }
    })
    .on('trackEnd', (player, track) => {
        console.log(`[Track End] -> ${track?.info?.title} -> Guilds ${player.guildId}`);
        console.log(`Queue length after track end: ${player.queue.length}`);
    })
    .on('trackError', (player, track) => {
        console.log(`[Track Error] -> ${track?.info?.title} -> Guilds ${player.guildId}`);
        console.error(`Error details: ${track?.error}`);
    })
    .on('trackStuck', (player, track) => {
        console.log(`[Track Stuck] -> ${track?.info?.title} -> Guilds ${player.guildId}`);
    })
    .on('queueEnd', (player, track) => {
        console.log(`[Queue Ended] -> ${track?.info?.title} -> Guilds ${player.guildId}`);
        console.log('Queue has ended.');
    });
}

module.exports = PlayerEvents;
