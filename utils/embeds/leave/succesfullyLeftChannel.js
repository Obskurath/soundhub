const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json");
const customEmoji = config.emojis.check;

function successfullyLeftChannelEmbed(user) {
    return new EmbedBuilder()
        .setColor(0x00ff00) // Set color to green
        .setTitle("👋 Goodbye!")
        .setDescription(`${customEmoji}・The bot has successfully left the voice channel.`)
        .setFooter({ text: `Requested by ${user.username}`, iconURL: user.displayAvatarURL() });
}

module.exports = successfullyLeftChannelEmbed;