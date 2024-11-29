const { SlashCommandBuilder } = require("discord.js");
const {
    joinVoiceChannelEmbed,
    botNotConnectedEmbed,
    sameVoiceChannelEmbed,
    noSongPlayingEmbed,
    resumePlayingEmbed,
    resumeErrorEmbed,
    alreadyPlayingEmbed,
    processingErrorEmbed
} = require("../../utils/embeds/index");

async function resumeTrack({ client, interaction }) {
    try {
        if (!interaction.guildId) return;

        await interaction.deferReply({ephemeral: true});

        const voiceChannel = interaction.member.voice.channelId;

        if (!voiceChannel) {
            const embed = joinVoiceChannelEmbed();
            return interaction.editReply({ embeds: [embed] });
        }

        const player = client.lavalink.getPlayer(interaction.guildId);

        if (!player) {
            const embed = botNotConnectedEmbed();
            return interaction.editReply({ embeds: [embed] });
        }

        if (player.voiceChannelId !== voiceChannel) {
            const embed = sameVoiceChannelEmbed();
            return interaction.editReply({ embeds: [embed] });
        }

        if (!player.queue.current) {
            const embed = noSongPlayingEmbed();
            return interaction.editReply({ embeds: [embed] });
        }

        if (player.paused) {
            try {
                await player.resume();
                const embed = resumePlayingEmbed();
                await interaction.editReply({ embeds: [embed] });
            } catch (error) {
                console.error(error);
                const embed = resumeErrorEmbed();
                await interaction.editReply({ embeds: [embed] });
            }
        } else {
            const embed = alreadyPlayingEmbed();
            await interaction.editReply({ embeds: [embed] });
        }
    } catch (error) {
        console.error(error);
        const embed = processingErrorEmbed();
        return interaction.editReply({ embeds: [embed] });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the currently playing song."),
    execute: resumeTrack,
    resumeTrack, // Export the function
};
