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

        // const thumbnailUrl = track.info.artworkUrl || 'https://example.com/thumbnail.jpg';

        const embed = {
            color: "12745742",
            description: currentTrack
                ? `🎵 **Now Playing:** \`${currentTrack.info.title}\`\n\n> **🎶 Song Added:** \`${track.info.title}\`\n\n✨ Enjoy the groove!`
                : `🎵 **Song Added!**\n\n> 🛑 **Queue is empty!**\n\n🎧 Add more tracks to keep the party alive!`,
            fields: [
                {
                    name: "🎼 Queue Status",
                    value: player.queue.tracks.length > 0
                        ? `🎶 **Next Up:** \`${player.queue.tracks[0]?.info.title || "Unknown Title"}\``
                        : "🛑 **No more tracks queued.**",
                },
            ],
            thumbnail: {
                url: currentTrack?.info.artworkUrl || "https://example.com/default-thumbnail.png",
            },
        };
        await interaction.followUp({ embeds: [embed] });

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
            );

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('volume_up')
                    .setLabel("🔊 Volume Up")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('volume_down')
                    .setLabel('🔉 Volume Down')
                    .setStyle(ButtonStyle.Secondary)
            )

        await interaction.editReply({ embeds: [embed], components: [row1, row2, row3] });
    }
};
