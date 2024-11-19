const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Exits the voice channel."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue) {
            await interaction.reply("There is no song playing");
            return;
        }

        //Disconnects from the voice chat
        queue.connection.disconnect();

        await interaction.reply("Why you bully me? :c");
    }
};