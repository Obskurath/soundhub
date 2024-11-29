const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json")
const customEmoji = config.emojis.check;

function pausedPlayingEmbed() {
    return new EmbedBuilder()
        .setColor(0x00ff00)
        .setDescription(`${customEmoji} Paused playing!`)
}

module.exports = pausedPlayingEmbed;