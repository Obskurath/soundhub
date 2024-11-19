const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play songs or playlists from YouTube.")
        .addStringOption(option =>
            option
                .setName("search")
                .setDescription("Search keywords or URL.")
                .setRequired(true)
        ),
    execute: async ({ client, interaction }) => {
        await interaction.deferReply();

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply({
                content: "You need to be in a voice channel to play music!",
                ephemeral: true
            });
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionsBitField.Flags.Connect) || !permissions.has(PermissionsBitField.Flags.Speak)) {
            return interaction.editReply({
                content: "I need permission to join and speak in your voice channel!",
                ephemeral: true
            });
        }

        // Get the guild queue, create it if it doesn't exist
        let queue = client.player.queues.get(interaction.guild.id);
        if (!queue) {
            queue = await client.player.queues.create(interaction.guild);
        }

        try {
            // Conectar al canal de voz si no estamos conectados
            if (!queue.connection) {
                console.log(`Connecting to voice channel: ${voiceChannel.name}`);
                await queue.connect(voiceChannel);
            }

            const searchTerm = interaction.options.getString("search");
            let embed = new EmbedBuilder();

            console.log(`Searching for: ${searchTerm}`);
            const result = await client.player.search(searchTerm, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (!result || result.tracks.length === 0) {
                return interaction.editReply({
                    content: "No results found for your search terms.",
                    ephemeral: true
                });
            }

            const song = result.tracks[0];
            console.log(`Adding song: ${song.title} to queue`);
            await queue.addTrack(song);

            // Inside the try block, before setting up the embed
            let embedDescription = queue.isPlaying() 
                ? `🎵 Added **[${song.title}](${song.url})** to the queue.`
                : `🎵 Playing now **[${song.title}](${song.url})**`;

            embed = new EmbedBuilder()
                .setDescription(embedDescription)
                .setColor('#0099ff')
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration || "Unknown"}` });

            // Iniciar la reproducción si no está en curso
            if (!queue.isPlaying()) {
                console.log("Starting playback");
                await queue.node.play();
                console.log("Playback started");
            }

            await interaction.editReply({ 
                embeds: [embed],
                ephemeral: true 
            });

        } catch (error) {
            console.error("Error processing search:", error);
            await interaction.editReply({
                content: "An error occurred while processing your request. Please try again.",
                ephemeral: true
            });
        }
    },
};
