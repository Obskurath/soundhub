const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Define the slash command data using the SlashCommandBuilder
    data: new SlashCommandBuilder()
        .setName("resume")  // Command name is "resume"
        .setDescription("Tell the bot to continue playing music after it has been paused."),  // Description of what the command does

    // The execute function will be triggered when the user invokes the command
    async execute({ client, interaction }) {
        try {
            // Check if the interaction is part of a guild (server)
            // If there is no guildId, return (don't proceed)
            if (!interaction.guildId) return;

            // Defer the reply to allow time for processing the command
            await interaction.deferReply();

            // Get the voice channel the user is in
            const voiceChannel = interaction.member.voice.channelId;

            // If the user is not in a voice channel, reply with an error message
            if (!voiceChannel) return interaction.editReply("Please join the voice channel before using the command.");

            // Retrieve the Lavalink player for the current guild
            const player = client.lavalink.getPlayer(interaction.guildId);

            // If no player is found, it means the bot is not connected to a voice channel
            if (!player) return interaction.editReply("Unfortunately, the bot is not connected to the voice channel you are on.");

            // Check if the user is in the same voice channel as the bot
            if (player.voiceChannelId !== voiceChannel) return interaction.editReply("You must be in the same voice channel as the bot.");

            // If there is no song currently playing in the queue, send a reply saying so
            if (!player.queue.current) return interaction.editReply("There are no songs playing right now.");

            // Resume the music that was paused
            await player.resume();

            // Respond to the user that the music has been resumed
            await interaction.editReply("I have resumed playing music. To pause the song, type /pause.");
        } catch (error) {
            // Log any errors that occur during the command execution
            console.error(error);
            return interaction.editReply("An error occurred while processing the command.");
        }
    }
};
