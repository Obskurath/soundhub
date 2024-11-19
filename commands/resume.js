const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.reply({
                content: "There is no song currently paused.",
                ephemeral: true
            });
            return;
        }

        try {
            // Reanudar la canción usando el nodo del reproductor
            queue.node.setPaused(false);

            await interaction.reply({
                content: "▶️ Resumed playing the song."
            });
        } catch (error) {
            console.error("Error resuming the song:", error);
            await interaction.reply({
                content: "❌ An error occurred while trying to resume the song.",
                ephemeral: true
            });
        }
    }
};
