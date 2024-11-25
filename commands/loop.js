const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Create the Slash Command with the name "loop" and description
    // This command allows users to set a loop mode for the song or queue
    data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Order the bot to repeat the song.")
        .addStringOption(option => 
            option.setName("mode")
                .setDescription("Select loop mode")
                .addChoices(
                    { name: "Track", value: "track" },  // Loop the current track
                    { name: "Queue", value: "queue" },  // Loop the entire queue
                    { name: "None", value: "off" }      // Turn off the loop
                )
                .setRequired(true)  // Make the "mode" option required
        ),

    // The execute function is triggered when the user invokes the command
    async execute({ client, interaction }) {
        try {
            // Check if the interaction is part of a guild (server)
            // If there is no guildId, return (do not proceed with the command)
            if (!interaction.guildId) return;

            // Defer the reply to give time for processing the command
            await interaction.deferReply();

            // Get the voice channel the user is in
            const voiceChannel = interaction.member.voice.channelId;

            // If the user is not in a voice channel, reply with an error message
            if (!voiceChannel) {
                return interaction.editReply("Please join the voice channel before using the command.");
            }

            // Retrieve the Lavalink player for the current guild
            const player = client.lavalink.getPlayer(interaction.guildId);

            // If no player is found, it means the bot is not connected to a voice channel
            if (!player) {
                return interaction.editReply("Unfortunately, the bot is not connected to the voice channel you are on.");
            }

            // Check if the user is in the same voice channel as the bot
            if (player.voiceChannelId !== voiceChannel) {
                return interaction.editReply("You must be in the same voice channel as the bot.");
            }

            // If there is no song currently playing in the queue, send a reply saying so
            if (!player.queue.current) {
                return interaction.editReply("There are no songs playing right now.");
            }

            // Set the loop mode based on the user's choice (track, queue, or off)
            await player.setRepeatMode(interaction.options.getString("mode"));

            // Reply to the user indicating the loop mode that has been enabled
            await interaction.editReply(`**Loop mode is now set to: ${player.repeatMode}**`);
        } catch (error) {
            // Log any errors that occur during the command execution
            console.error(error);
            return interaction.editReply("An error occurred while processing the command.");
        }
    }
};
