const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play").setDescription("Play a song from a query or URL")
        .addStringOption(option => option.setName("query").setDescription("The Song name or URL to play").setRequired(true)),
    async execute({ client, interaction }) {
        await interaction.deferReply();

        const query = interaction.options.getString("query");
        const voiceChannel = interaction.member?.voice.channel;
        if (!voiceChannel) {
            return interaction.editReply("You must join a voice channel first before playing a song.")
        }

        const player = client.lavalink.getPlayer(interaction.guild.id) || await client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: voiceChannel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,
            selfMute: false,
            volume: 100, // Default volume
        });
        // Check if the player is already connected to a voice channel
        const connected = player.connected;
        if (!connected) await player.connect();

        try {
            // Search for the song based on the query (song name or URL)
            const response = await player.search({ query, source: "scsearch" }, interaction.user);

            if (!response || !response.tracks.length) {
                return interaction.editReply(`No tracks found for: ${query}`);
            }

            // Get the first track from the search results
            const track = response.tracks[0];

            // Add the track to the player's queue
            player.queue.add(track);

            // If the player is not already playing, start playing the track
            if (!player.playing) {
                await player.play();
                return interaction.editReply(`Now playing: ${track.info.title}`);
            }
        } catch (error) {
            console.error(error);
            return interaction.editReply("There was an error trying to play the song.");
        }
    }
}