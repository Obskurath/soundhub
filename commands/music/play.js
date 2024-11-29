const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder
} = require('discord.js');

const { createNowPlayingImage, getAverageColor } = require("../../utils/canvasHelper");
const { loadImage } = require('canvas'); 

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

        await interaction.deferReply();

        const query = interaction.options.getString("query");
        const voiceChannel = interaction.member?.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply("You need to be in a voice channel to play music!");
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
            return interaction.editReply(`No tracks found for: ${query}`);
        }

        const track = response.tracks[0];
        player.queue.add(track);

        if (!player.playing) {
            await player.play();
        }

        const currentTrack = player.queue.current;
        if (!currentTrack) {
            return interaction.reply("No track is currently playing.");
        }

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

        await interaction.editReply({ embeds: [embed], files: [attachment] });

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

        await interaction.editReply({ embeds: [embed], components: [row1, row2] });
    }
};

function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g).map(Number);
    return (r << 16) + (g << 8) + b;
}
