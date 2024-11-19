const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song."),
    execute: async ({client, interaction}) => {
        const queue = client.player.queues.get(interaction.guild);

        if(!queue) {
            await interaction.reply({
                content:"There is no song playing",
                ephemeral: true
            });
            return;
        }

       queue.setPaused(true);

       await interaction.reply({
            content:"The current song has been paused",
            ephemeral: true
        }
       )

    }
}