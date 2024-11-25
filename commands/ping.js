const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping Bot"),
    execute: async ({ interaction }) => {
        // Responder al usuario
        await interaction.reply({
            content: "Ping",
            ephemeral: true,
        });
    },
};