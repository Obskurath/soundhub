const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json")
const customEmoji = config.emojis.error;

function joinVoiceChannelEmbed() {
    return new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${customEmoji} Please join the voice channel before using the command.`)
}

module.exports = joinVoiceChannelEmbed;