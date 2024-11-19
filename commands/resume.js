const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song."),
    execute: async ({client, interaction}) => {
        const queue = client.player.queues.get(interaction.guild);

        if(!queue) {
            await interaction.reply({
                content: "There is no song playing",
                ephemeral: true
            });

            return;
        }

       queue.setPaused(false);

       await interaction.reply({
        content: "Resumed playing",
        ephemeral: true
    });

    }
}