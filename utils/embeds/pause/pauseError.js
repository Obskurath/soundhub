const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json")
const customEmoji = config.emojis.error;

function pauseErrorEmbed() {
    return new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${customEmoji}・An error occurred while pausing the player.`)
}

module.exports = pauseErrorEmbed;