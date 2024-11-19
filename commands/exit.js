const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exits the voice channel."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue) {
            await interaction.reply({
                content: "The bot is not connected to the voice channel.",
                ephemeral: true,
            });
            return;
        }

        // Disconnects from the voice chat
        queue.connection.disconnect();

        await interaction.reply({
            content: "Why you bully me? :c",
            ephemeral: true,
        });
    },
};
