const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.current) {
            await interaction.reply({
                content: "There is no song currently playing.",
                ephemeral: true,
            });
            return;
        }

        const currentSong = queue.current;
        await queue.node.skip(); // Cambiado a `queue.node.skip` según la nueva API de discord-player

        await interaction.reply({
            embeds: [
            new EmbedBuilder()
                .setDescription(`Skipped **${currentSong.title}**`)
                .setThumbnail(currentSong.thumbnail)
            ],
            ephemeral: true,
        });
    },
};
