const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")  // Set the name of the slash command (e.g., "/skip")
        .setDescription("Skip a song to go to the next song from the queue.") // Description of what the command does
        .addIntegerOption(option =>
            option.setName("skip_queue")  // Option name for skipping the queue
                .setDescription("Skip to the next song queue.")  // Description of what this option does
                .setRequired(false)),  // This option is optional, so it's not required

    // The execute function will be triggered when the user invokes the command
    async execute({ client, interaction }) {
        try {
            // Ensure the interaction is part of a guild (server) before proceeding
            if (!interaction.guildId) return;

            // Defer the reply to allow time for processing the command
            await interaction.deferReply();

            // Get the voice channel the user is currently in
            const voiceChannel = interaction.member.voice.channelId;

            // If the user is not in a voice channel, reply with an error message
            if (!voiceChannel) return interaction.editReply("Please join the voice channel before using the command.");

            // Retrieve the Lavalink player associated with the current guild
            const player = client.lavalink.getPlayer(interaction.guildId);

            // If no player is found, it means the bot is not connected to a voice channel
            if (!player) return interaction.editReply("Unfortunately, the bot is not connected to the voice channel you are on.");

            // Check if the user is in the same voice channel as the bot
            if (player.voiceChannelId !== voiceChannel) return interaction.editReply("You must be in the same voice channel as the bot.");

            // If no song is currently playing, send a reply stating that
            if (!player.queue.current) return interaction.editReply("There are no songs playing right now.");

            const currentTrack = player.queue.current;  // Get the current song being played
            const nextTrack = player.queue.tracks[0];  // Get the next song in the queue

            // If no next track is available, return an error message
            if (!nextTrack) return interaction.editReply("Can't find a song that needs to be skipped.");

            // If an optional integer parameter is provided (e.g., skip to specific track in queue), use it
            await player.skip(interaction.options.getInteger("skip_queue"));

            // Send a reply indicating which song was skipped and what is now playing
            await interaction.editReply(
                currentTrack  // If there is a current track playing
                    ? `Skipped the song ${currentTrack.info.title}. Now playing: ${nextTrack.info.title}`  // Show current song title and next song
                    : `Skipped to the next song: ${nextTrack.info.title}`  // If no current song, just show next song
            );
        } catch (error) {
            // Log any errors that occur during the command execution for debugging
            console.error(error);
            return interaction.editReply("An error occurred while processing the command.");
        }
    }
};
