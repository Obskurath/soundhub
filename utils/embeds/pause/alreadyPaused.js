const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json");
const customEmoji = config.emojis.warning;

function alreadyPausedEmbed() {
    return new EmbedBuilder()
        .setColor(0xffa500)
        .setDescription(`${customEmoji} The player is already paused!`)
}

module.exports = alreadyPausedEmbed;