const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require('discord.js');

// Canvas
const { createNowPlayingImage, getAverageColor } = require("../../utils/canvasHelper");
const { loadImage } = require('canvas');

// Embeds
const {
    noSongPlayingEmbed,
    joinVoiceChannelEmbed,
    noTracksFoundEmbed,
    addedToQueueEmbed,
    createNowPlayingEmbed
} = require('../../utils/embeds/index');

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

        const queue = player.queue.tracks;

        let embed;

        if (queue.length > 0) {
            embed = addedToQueueEmbed(track, queue.length);
            await interaction.editReply({ embeds: [embed] });
        } else {
            const { embed, components, files } = createNowPlayingEmbed(currentTrack, interaction, hexColor, attachment);
            await interaction.editReply({ embeds: [embed], components, files });
        }

    }
};

function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return (r << 16) + (g << 8) + b;
}
