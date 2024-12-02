const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

function createNowPlayingEmbed(currentTrack, player, hexColor, attachment) {
    return new EmbedBuilder()
        .setColor(hexColor) // Use the converted hex color for the embed
        .setDescription(`🔊・Now Playing **${currentTrack.info.title} - ${currentTrack.info.author}**`)
        .setImage('attachment://now-playing.png')
        .setFooter({ text: `Requested by ${player.queue.current.requester.displayName}` });
}

function createNowPlayingComponents(currentTrack) {
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('resume')
                .setEmoji('▶️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('pause')
                .setEmoji('⏸️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('skip')
                .setEmoji('⏭️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('stop')
                .setEmoji('⏹️')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setLabel('Listen Here')
                .setStyle(ButtonStyle.Link)
                .setURL(currentTrack.info.uri)
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('queue')
                .setLabel('View Queue')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('volume_down')
                .setLabel('🔉 Volume Down')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('volume_up')
                .setLabel("🔊 Volume Up")
                .setStyle(ButtonStyle.Secondary),
        );

    return [row1, row2];
}

function createNowPlaying(currentTrack, player, hexColor, attachment) {
    const embed = createNowPlayingEmbed(currentTrack, player, hexColor, attachment);
    const components = createNowPlayingComponents(currentTrack);

    return { embed, components, files: [attachment] };
}

module.exports = { createNowPlaying };