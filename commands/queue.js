const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue."),
    execute: async ({ client, interaction }) => {
        const queue = client.player.queues.get(interaction.guild.id);

        if (!queue || !queue.playing) {
            console.log("No queue or no song playing.");
            await interaction.reply({
                content: "There is no current playlist.",
                ephemeral: true,
            });
            return;
        }

        const queueString = queue.tracks
            .slice(0, 10)
            .map((song, i) => {
                return `${i + 1}) ${song.title}`;
            })
            .join("\n");

        const currentSong = queue.current;

        console.log("Current song:", currentSong);
        console.log("Queue tracks:", queue.tracks);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`Currently playing: ${currentSong.title}\n\nQueue:\n${queueString}`)
                    .setThumbnail(currentSong.thumbnail),
            ],
        });
    },
};
