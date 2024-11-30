const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/emojis.json');
const customEmoji = config.emojis.check;

function addedToQueueEmbed(track, queueLength) {
    return new EmbedBuilder()
        .setColor(0x00ff00) 
        .setDescription(`${customEmoji}・Added [${track.info.title}](${track.info.uri}) to the queue at position **${queueLength}**`)
}

module.exports = addedToQueueEmbed;