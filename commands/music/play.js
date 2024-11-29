const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require('discord.js');

// Canvas
const { createNowPlayingImage, getAverageColor } = require("../../utils/canvasHelper");
const { loadImage } = require('canvas'); 

// Embeds
const { noSongPlayingEmbed, joinVoiceChannelEmbed  }= require('../../utils/embeds/index');
const { noTracksFoundEmbed } = require('../../utils/embeds/play');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song from a query or URL")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("The Song name or URL to play")
                .setRequired(true)
        ),

    async execute({ client, interaction }) {
        if (!interaction.guildId) return;

        const query = interaction.options.getString("query");
        const voiceChannel = interaction.member?.voice.channel;

        if (!voiceChannel) {
            const embed = joinVoiceChannelEmbed();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const player = client.lavalink.getPlayer(interaction.guild.id) || await client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: voiceChannel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,
            selfMute: false,
            volume: 80,
        });

        if (!player.connected) await player.connect();

        const response = await player.search({ query, source: "ytmsearch" }, interaction.user);

        if (!response || !response.tracks.length) {
            const embed = noTracksFoundEmbed(query);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const track = response.tracks[0];
        player.queue.add(track);

        if (!player.playing) {
            await player.play();
        }

        const currentTrack = player.queue.current;
        if (!currentTrack) {
            const embed = noSongPlayingEmbed();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();

        // Create canvas image
        const buffer = await createNowPlayingImage(currentTrack);

        // Create attachment
        const attachment = new AttachmentBuilder(buffer, { name: 'now-playing.png' });

        // Embed Color
        const thumbnailUrl = currentTrack.info.artworkUrl || 'https://example.com/default-thumbnail.png';
        const thumbnail = await loadImage(thumbnailUrl);
        const glowColor = await getAverageColor(thumbnail);
        const hexColor = rgbToHex(glowColor);

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
                    .setLabel('Listen here')
                    .setStyle(ButtonStyle.Link)
                    .setURL(track.info.uri)
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

        // Send the main embed without ephemeral
        await interaction.editReply({ embeds: [embed], files: [attachment], components: [row1, row2] });
    }
};

function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return (r << 16) + (g << 8) + b;
}
