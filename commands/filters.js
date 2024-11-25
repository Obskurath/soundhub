const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Create the Slash Command with the name "filters" and description
    // This command will allow users to apply or remove filters for the song
    data: new SlashCommandBuilder()
        .setName("filters") // Command name
        .setDescription("Filters for the song") // Description of the command
        .addStringOption(option =>
            option.setName("mode") // Option to choose the filter mode
                .setDescription("Select a filter for the song") // Description of the mode option
                .addChoices( // Define available filter choices
                    { name: "Clear (Clear all filters)", value: "clear" },
                    { name: "Nightcore", value: "nightcore" },
                    { name: "Karaoke", value: "karaoke" }
                )
                .setRequired(true) // Make this option required
        ),

    // The execute function will be triggered when the user invokes the command
    async execute({ client, interaction }) {
        try {
            // Check if the interaction is part of a guild (server)
            // If there is no guildId, return (don't proceed)
            if (!interaction.guildId) return;

            // Defer the reply to allow time for processing the command
            await interaction.deferReply();

            // Get the voice channel the user is currently in
            const voiceChannel = interaction.member.voice.channelId;

            // If the user is not in a voice channel, send an error message
            if (!voiceChannel) return interaction.editReply("Please join the voice channel before using the command.");

            // Retrieve the Lavalink player for the current guild (server)
            const player = client.lavalink.getPlayer(interaction.guildId);

            // If no player is found, it means the bot is not connected to a voice channel
            if (!player) return interaction.editReply("Unfortunately, the bot is not connected to the voice channel you are on.");

            // Check if the user is in the same voice channel as the bot
            if (player.voiceChannelId !== voiceChannel) return interaction.editReply("You must be in the same voice channel as the bot.");

            // If there is no song currently playing in the queue, send an error message
            if (!player.queue.current) return interaction.editReply("There are no songs playing right now.");

            let message = ""; // Variable to hold the message based on the filter action
            const selectFilters = interaction.options.getString("mode"); // Get the selected filter mode

            // Switch statement to handle the different filter modes
            switch (selectFilters) {
                case "clear":
                    // If "clear" is selected, reset all filters
                    await player.filterManager.resetFilters();
                    message = "All filters have been disabled.";
                    break;
                case "nightcore":
                    // If "nightcore" is selected, toggle the Nightcore filter
                    await player.filterManager.toggleNightcore();
                    message = player.filterManager.filters.nightcore
                        ? "Nightcore has been enabled. If Karaoke is enabled, it's recommended to disable it!"
                        : "Nightcore has been disabled.";
                    break;
                case "karaoke":
                    // If "karaoke" is selected, toggle the Karaoke filter
                    await player.filterManager.toggleKaraoke();
                    message = player.filterManager.filters.karaoke
                        ? "Karaoke has been enabled. If Nightcore is enabled, it's recommended to disable it!"
                        : "Karaoke has been disabled.";
                    break;
                default:
                    message = "N/A"; // If no valid filter is selected, set message as "N/A"
                    break;
            }

            // Send the reply with the appropriate message based on the filter action
            await interaction.editReply(`${message}`);
        } catch (error) {
            // Log any errors that occur during the command execution
            console.error(error);
            // Send a generic error message to the user
            return interaction.editReply("An error occurred while processing the command.");
        }
    }
};
