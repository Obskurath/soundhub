const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.current) {
            console.log("No queue or no song currently playing.");
            await interaction.reply({
                content: "There is no song currently playing.",
                ephemeral: true,
            });
            return;
        }

        const currentSong = queue.current;
        console.log("Skipping song:", currentSong.title);

        try {
            await queue.node.skip();
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`⏭️ Skipped **${currentSong.title}**`)
                        .setThumbnail(currentSong.thumbnail || ''),
                ],
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error skipping song:", error);
            await interaction.reply({
                content: "❌ An error occurred while trying to skip the song.",
                ephemeral: true,
            });
        }
    },
};
