const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

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

        const response = await player.search({ query, source: "scsearch" }, interaction.user);

        if (!response || !response.tracks.length) {
            return interaction.editReply(`No tracks found for: ${query}`);
        }

        const track = response.tracks[0];
        player.queue.add(track);

        if (!player.playing) {
            await player.play();
        }

        const thumbnailUrl = track.info.artworkUrl || 'https://example.com/thumbnail.jpg';
        const duration = track.info.length || "Unknown";

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`🎵 Playing now:  **[${track.info.title}](${track.info.uri})**\n\n Requested by: ${interaction.user.username}\n`)
            .setThumbnail(thumbnailUrl)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('play/pause')
                    .setEmoji('⏯')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('stop')
                    .setEmoji('⏹️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setEmoji('⏭️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setLabel('Listen here')
                    .setStyle(ButtonStyle.Link)
                    .setURL(track.info.uri)
            );

        await interaction.editReply({ embeds: [embed], components: [row] });
    }
};
