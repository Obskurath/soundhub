const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stops playback"),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "There is no song currently playing.",
                ephemeral: true
            });
        }

        const currentTrack = queue.currentTrack;
        const voiceConnection = queue.connection;

        // Stop and clear without destroying connection
        queue.tracks.clear();
        await queue.node.stop();
        
        // Keep connection alive
        if (voiceConnection) {
            // Remove any existing disconnect handlers
            voiceConnection.removeAllListeners('stateChange');
            
            // Add our delayed disconnect
            setTimeout(async () => {
                await queue.delete();
            }, 30000);
        }

        const embed = new EmbedBuilder()
            .setDescription(`⏹ Stopped playing **[${currentTrack.title}](${currentTrack.url})** and cleared the queue\n\nLeaving in 30 seconds...`)
            .setThumbnail(currentTrack.thumbnail)
            .setColor('#FF0000');

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    },
};
