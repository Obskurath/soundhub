const { EmbedBuilder } = require('discord.js');
const config = require("../../config/emojis.json")
const customEmoji = config.emojis.error;

function botNotConnectedEmbed() {
    return new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${customEmoji} Unfortunately, the bot is not connected to the voice channel you are on.`)
}

module.exports = botNotConnectedEmbed;