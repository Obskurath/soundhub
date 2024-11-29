const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json")
const customEmoji = config.emojis.warning;

function sameVoiceChannelEmbed() {
    return new EmbedBuilder()
        .setColor(0xffa500)
        .setDescription(`${customEmoji} You must be in the same voice channel as the bot.`)
}

module.exports = sameVoiceChannelEmbed;