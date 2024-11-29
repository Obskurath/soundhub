const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json");
const customEmoji = config.emojis.cross;

function resumeErrorEmbed() {
    return new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${customEmoji} Error resuming the track.`);
}

module.exports = resumeErrorEmbed;