const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exits the voice channel."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        // Verificar si el bot está conectado a un canal de voz
        if (!queue || !queue.connection) {
            await interaction.reply({
                content: "The bot is not connected to a voice channel.",
                ephemeral: true,
            });
            return;
        }

        // Desconectar al bot del canal de voz
        queue.connection.disconnect();

        // Responder al usuario
        await interaction.reply({
            content: "Why you bully me? :c",
            ephemeral: true,
        });
    },
};
