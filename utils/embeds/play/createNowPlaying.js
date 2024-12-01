const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');


function createNowPlayingEmbed(currentTrack, interaction, hexColor, attachment) {
    const embed = new EmbedBuilder()
        .setColor(hexColor) // Use the converted hex color for the embed
        .setDescription(`🔊 Now Playing **${currentTrack.info.title} - ${currentTrack.info.author}**`)
        .setImage('attachment://now-playing.png')
        .setFooter({ text: `Requested by ${interaction.member.displayName}` });

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

    return { embed, components: [row1, row2], files: [attachment] };
}

module.exports = createNowPlayingEmbed