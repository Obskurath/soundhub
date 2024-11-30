const { EmbedBuilder } = require('discord.js');
const config = require('../../../config/emojis.json');
const customEmoji = config.emojis.error;

function noTracksFoundEmbed(query) {
    return new EmbedBuilder()
        .setColor(0xff0000) 
        .setDescription(`${customEmoji}・No tracks found for: ${query}`)
}

module.exports = noTracksFoundEmbed;