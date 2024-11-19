const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "There is no song currently playing.",
                ephemeral: true
            });
        }

        const currentSong = queue.currentTrack;

        // Skip the current song
        await queue.node.skip();

        const embed = new EmbedBuilder()
            .setDescription(`⏭ Skipped **[${currentSong.title}](${currentSong.url})**`)
            .setThumbnail(currentSong.thumbnail);
            
           
        

        await interaction.reply({
            embeds: [embed],
            ephemeral:true
        });
    },
};
