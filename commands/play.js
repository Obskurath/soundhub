const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Create the Slash Command with the name "play" and description
    // This command will play a song from a query or URL provided by the user
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song from a query or URL")
        .addStringOption(option =>
            option.setName("query")
                .setDescription("The Song name or URL to play")
                .setRequired(true)
        ),

    // The execute function will be triggered when the user invokes the command
    async execute({ client, interaction }) {
        // If the interaction doesn't have a guildId (i.e., not in a server), exit
        if (!interaction.guildId) return;

        // Defer the reply to give time to process the command
        await interaction.deferReply();

        // Get the song query (song name or URL) from the interaction options
        const query = interaction.options.getString("query");

        // Get the voice channel that the user is currently in
        const voiceChannel = interaction.member?.voice.channel;

        // If the user is not in a voice channel, reply with an error message
        if (!voiceChannel) {
            return interaction.editReply("You must join a voice channel first before playing a song.");
        }

        // Get the Lavalink player for the current guild (server)
        // If no player exists, create a new one with the required properties
        const player = client.lavalink.getPlayer(interaction.guild.id) || await client.lavalink.createPlayer({
            guildId: interaction.guild.id,
            voiceChannelId: voiceChannel.id,
            textChannelId: interaction.channel.id,
            selfDeaf: true,  // Bot will be deafened in the voice channel
            selfMute: false,  // Bot will not be muted
            volume: 80,       // Default volume is 80
        });

        // Check if the player is already connected to a voice channel
        const connected = player.connected;
        if (!connected) await player.connect(); // Connect the player to the voice channel if not already connected

        try {
            // Search for the song using the provided query (could be a song name or a URL)
            const response = await player.search({ query, source: "ytsearch" }, interaction.user);

            // If no tracks are found, reply with a message stating so
            if (!response || !response.tracks.length) {
                return interaction.editReply(`No tracks found for: ${query}`);
            }

            // Get the first track from the search results (this is the track that will be played)
            const track = response.tracks[0];

            // Add the track to the player's queue
            player.queue.add(track);

            // If the player is not already playing a song, start playing the track
            if (!player.playing) {
                await player.play();
                return interaction.editReply(`Now playing: ${track.info.title}`);
            }
        } catch (error) {
            // Log any errors that occur during the process and send an error message to the user
            console.error(error);
            return interaction.editReply("There was an error trying to play the song.");
        }
    }
}
