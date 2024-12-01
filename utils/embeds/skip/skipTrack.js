const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/emojis.json');
const customEmoji = config.emojis.check;

function startedPlayingEmbed(track) {
    if (!track || !track.info) {
        throw new Error('Track information is missing or undefined.');
    }

    return new EmbedBuilder()
        .setColor(0x00ff00) 
        .setDescription(`${customEmoji}・Successfully skipped **[${track.info.title}](${track.info.uri})**.`);
}

module.exports = startedPlayingEmbed;
