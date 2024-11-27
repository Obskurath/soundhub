const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("filters")
        .setDescription("Filters for the song")
        .addStringOption(option =>
            option.setName("mode")
                .setDescription("Select a filter for the song")
                .addChoices(
                    { name: "Clear (Clear all filters)", value: "clear" },
                    { name: "Nightcore", value: "nightcore" },
                    { name: "Karaoke", value: "karaoke" },
                    { name: "Vaporwave", value: "vaporwave" },
                    { name: "LowPass", value: "lowpass" },
                    { name: "Rotation", value: "rotation" },
                    { name: "Tremolo", value: "tremolo" },
                    { name: "Vibrato", value: "vibrato" }
                )
                .setRequired(true)
        ),

    async execute({ client, interaction }) {
        try {
            if (!interaction.guildId) return;

            await interaction.deferReply();

            const voiceChannel = interaction.member.voice.channelId;

            if (!voiceChannel) return interaction.editReply("Please join the voice channel before using the command.");

            const player = client.lavalink.getPlayer(interaction.guildId);

            if (!player) return interaction.editReply("Unfortunately, the bot is not connected to the voice channel you are on.");

            if (player.voiceChannelId !== voiceChannel) return interaction.editReply("You must be in the same voice channel as the bot.");

            if (!player.queue.current) return interaction.editReply("There are no songs playing right now.");

            let message = "";
            const selectFilters = interaction.options.getString("mode");

            switch (selectFilters) {
                case "clear":
                    await player.filterManager.resetFilters();
                    message = "All filters have been disabled.";
                    break;
                case "nightcore":
                    await player.filterManager.toggleNightcore();
                    message = player.filterManager.filters.nightcore
                        ? "Nightcore has been enabled. If Karaoke is enabled, it's recommended to disable it!"
                        : "Nightcore has been disabled.";
                    break;
                case "karaoke":
                    await player.filterManager.toggleKaraoke();
                    message = player.filterManager.filters.karaoke
                        ? "Karaoke has been enabled. If Nightcore is enabled, it's recommended to disable it!"
                        : "Karaoke has been disabled.";
                    break;
                case "lowpass":
                    await player.filterManager.toggleLowPass();
                    message = player.filterManager.filters.lowPass
                        ? "The LowPass filter has been activated."
                        : "The LowPass filter has been disabled.";
                case "vaporwave":
                    await player.filterManager.toggleVaporwave();
                    message = player.filterManager.filters.vaporwave
                        ? "The Vaporwave filter has been activated."
                        : "The Vaporwave filter has been disabled.";
                case "rotation":
                    await player.filterManager.toggleRotation();
                    message = player.filterManager.filters.rotation
                        ? "The Rotation filter has been activated."
                        : "The Rotation filter has been disabled.";
                case "tremolo":
                    await player.filterManager.toggleTermolo();
                    message = player.filterManager.filters.termolo
                        ? "The Termolo filter has been activated."
                        : "The Termolo filter has been disabled.";
                case "vibrato":
                    await player.filterManager.toggleVibrato();
                    message = player.filterManager.filters.vibrato
                        ? "The Vibrato filter has been activated."
                        : "The Vibrato filter has been disabled.";
                default:
                    message = "N/A";
                    break;
            }

            // Create the Embed using EmbedBuilder with light pink color
            const embed = new EmbedBuilder()
                .setColor('#FFC0CB') // Set the color of the embed to light pink
                .setTitle("Filter Update") // Title of the embed
                .setDescription(message) // Main message content
                .addFields({ name: "Selected Filter:", value: selectFilters.charAt(0).toUpperCase() + selectFilters.slice(1) }) // Display the filter selected
                .setFooter({ text: "Lavalink Player" }) // Footer of the embed
                .setTimestamp(); // Add a timestamp

            // Send the reply with the embed
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.editReply("An error occurred while processing the command.");
        }
    }
};
