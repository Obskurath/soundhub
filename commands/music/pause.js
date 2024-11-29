const { SlashCommandBuilder } = require("discord.js");
const joinVoiceChannelEmbed = require("../../utils/embeds/joinVoiceChannel");
const botNotConnectedEmbed = require("../../utils/embeds/botNotconnected");
const sameVoiceChannelEmbed = require("../../utils/embeds/sameVoiceChannel");
const noSongPlayingEmbed = require("../../utils/embeds/noSongPlaying");
const pausedPlayingEmbed = require("../../utils/embeds/pause/pausedPlaying");
const pauseErrorEmbed = require("../../utils/embeds/pause/pauseError");
const alreadyPausedEmbed = require("../../utils/embeds/pause/alreadyPaused");
const processingErrorEmbed = require("../../utils/embeds/processingError");

async function pauseTrack({ client, interaction }) {
    try {
        if (!interaction.guildId) return;

        await interaction.deferReply({ephemeral:true});

        const voiceChannel = interaction.member.voice.channelId;

        if (!voiceChannel) {
            const embed = joinVoiceChannelEmbed()
            return interaction.editReply({embeds: [embed]});
        }

        const player = client.lavalink.getPlayer(interaction.guildId);

        if (!player) {
            const embed = botNotConnectedEmbed()
            return interaction.editReply({embeds:[embed]});
        }

        if (player.voiceChannelId !== voiceChannel) {
            const embed = sameVoiceChannelEmbed()
            return interaction.editReply({embeds:[embed]});
        }

        if (!player.queue.current) {
            const embed = noSongPlayingEmbed()
            return interaction.editReply({embeds:[embed]});
        }

        if (!player.paused) {
            try {
                await player.pause();
                const embed = pausedPlayingEmbed()
                await interaction.editReply({embeds:[embed]});
            } catch (error) {
                console.error(error);
                const embed = pauseErrorEmbed()
                await interaction.editReply({embeds:[embed]});
            }
        } else {
            const embed = alreadyPausedEmbed()
            await interaction.editReply({embeds:[embed]});
        }
    } catch (error) {
        console.error(error);
        const embed = processingErrorEmbed()
        return interaction.editReply({embeds:[embed]});
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause the currently playing song."),
    execute: pauseTrack,
    pauseTrack, // Export the function
};
