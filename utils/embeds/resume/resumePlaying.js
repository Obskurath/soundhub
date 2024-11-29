const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json");
const customEmoji = config.emojis.check;

function resumePlayingEmbed() {
    return new EmbedBuilder()
        .setColor(0x00ff00)
        .setDescription(`${customEmoji} Resumed playing!`);
}

module.exports = resumePlayingEmbed;