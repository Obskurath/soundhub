const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Shows the first 10 songs in the queue."),
    execute: async ({client, interaction}) => {
        const queue = client.player.queues.get(interaction.guild);

        if(!queue || !queue.playing) {
            await interaction.reply({
                content: "There is no current playlist",
                ephemeral: true
            })
            return;
        }

        const queueString = queue.tracks.slice(0,10).map((song, i) => {
            return `${i + 1}) [${song.duration}]\` ${song.title} - <@${song.requestBy.id}>`;
        }).join("\n")

        const currentSong = queue.current;

        await interaction.reply({
            embeds : [
                new EmbedBuilder()
                .setDescription(`Currently playing: \n\` ${currentSong.title} - <@${currentSong.requestBy.id}>\n\n Queue:\n${queueString}`)
                .SetThumbnail(currentSong.thumbnail)
            ]
        })
    }

}