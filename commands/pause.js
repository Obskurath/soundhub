const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.reply({
                content: "There is no song currently playing.",
                ephemeral: true
            });
            return;
        }

        try {
            // Pausar la canción usando el nodo del reproductor
            queue.node.setPaused(true);

            await interaction.reply({
                content: "⏸️ The current song has been paused."
            });
        } catch (error) {
            console.error("Error pausing the song:", error);
            await interaction.reply({
                content: "❌ An error occurred while trying to pause the song.",
                ephemeral: true
            });
        }
    }
};
