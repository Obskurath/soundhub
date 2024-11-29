const joinVoiceChannelEmbed = require('./joinVoiceChannel');
const botNotConnectedEmbed = require('./botNotConnected');
const sameVoiceChannelEmbed = require('./sameVoiceChannel');
const noSongPlayingEmbed = require('./noSongPlaying');
const processingErrorEmbed = require('./processingError');

module.exports = {
    joinVoiceChannelEmbed,
    botNotConnectedEmbed,
    sameVoiceChannelEmbed,
    noSongPlayingEmbed,
    processingErrorEmbed,
};