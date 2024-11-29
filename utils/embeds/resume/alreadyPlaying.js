const { EmbedBuilder } = require('discord.js');
const config = require("../../../config/emojis.json");
const customEmoji = config.emojis.warning;

function alreadyPlayingEmbed() {
    return new EmbedBuilder()
        .setColor(0xffff00)
        .setDescription(`${customEmoji} The track is already playing.`);
}

module.exports = alreadyPlayingEmbed;