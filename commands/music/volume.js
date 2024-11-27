const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("volume") // Command name
        .setDescription("Command the bot to adjust the song's volume.") // Description of the command
        .addIntegerOption(option =>
            option.setName("volume") // Option name for the volume level
                .setDescription("The level you want, ranging from 0 to 100.") // Description of the option
                .setMaxValue(100) // Maximum value for volume
                .setMinValue(0) // Minimum value for volume
                .setRequired(true) // Make this option mandatory
        ),

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

            // Set the volume to the specified level from the user's input
            await player.setVolume(interaction.options.getInteger("volume"));

            // Send a reply confirming the current volume level
            await interaction.editReply(`Current volume adjusted to: ${player.volume}%`);
        } catch (error) {
            // Log any errors that occur during the command execution
            console.error(error);
            // Send a generic error message to the user
            return interaction.editReply("An error occurred while processing the command.");
        }
    }
};
