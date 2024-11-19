const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.node.isPlaying()) {
            return interaction.reply({
                content: "There is no song currently playing.",
                ephemeral: true
            });
        }

        // Get current track
        const currentTrack = queue.currentTrack;
        
        // Get upcoming tracks
        const tracks = queue.tracks.data;

        const queueString = tracks
            .slice(0, 10)
            .map((track, i) => {
                return `${i + 1}) [${track.title}](${track.url})`;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setDescription(`**Currently Playing:**\n🎵 [${currentTrack.title}](${currentTrack.url})\n\n**Queue:**\n${queueString || "No songs in queue"}`)
            .setThumbnail(currentTrack.thumbnail);

        return interaction.reply({
            embeds: [embed]
        });
    },
};
