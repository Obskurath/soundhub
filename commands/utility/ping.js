const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong! 🏓"),
    execute: async ({ interaction }) => {
        // Responder al usuario
        await interaction.reply({
            content: "Pong! 🏓",
            ephemeral: true,
        });
    },
};