const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json")
const customEmoji = config.emojis.error;

function noSongPlayingEmbed() {
    return new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${customEmoji}・There is no song currently playing.`)
}

module.exports = noSongPlayingEmbed;