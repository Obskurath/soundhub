const {
    SlashCommandBuilder,
    AttachmentBuilder
} = require('discord.js');

// Embeds
const {
    noSongPlayingEmbed,
    joinVoiceChannelEmbed,
    noTracksFoundEmbed,
    addedToQueueEmbed,
    startedPlayingEmbed
} = require('../../utils/embeds/index');
const { EmbedBuilder } = require('discord.js');

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

        const queue = player.queue.tracks;

        try {
            if (queue.length > 0) {
                const embed = addedToQueueEmbed(track, queue.length);
                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.deferReply();
                const embed = startedPlayingEmbed(track);
                await interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            await interaction.reply({ content: 'An error occurred while processing your request.', ephemeral: true });
        }
    }
};