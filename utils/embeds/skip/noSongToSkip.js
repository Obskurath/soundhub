const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/emojis.json');
const customEmoji = config.emojis.warning;

function startedPlayingEmbed(track) {
    if (!track || !track.info) {
        throw new Error('Track information is missing or undefined.');
    }

    return new EmbedBuilder()
        .setColor(0xffff00) 
        .setDescription(`${customEmoji}・There is no song to be skipped`);
}

module.exports = startedPlayingEmbed;
