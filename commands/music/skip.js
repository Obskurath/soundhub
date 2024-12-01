const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannelEmbed, botNotConnectedEmbed, sameVoiceChannelEmbed, noSongPlayingEmbed, processingErrorEmbed, noSongToSkipEmbed, skipTrackEmbed } = require("../../utils/embeds/index");

async function skipTrack({ client, interaction }) {
    try {
        if (!interaction.guildId) return;

        
        const voiceChannel = interaction.member.voice.channelId;
        
        if (!voiceChannel) {
            const embed = joinVoiceChannelEmbed();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const player = client.lavalink.getPlayer(interaction.guildId);
        
        if (!player) {
            const embed = botNotConnectedEmbed();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        if (player.voiceChannelId !== voiceChannel) {
            const embed = sameVoiceChannelEmbed();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        if (!player.queue.current) {
            const embed = noSongPlayingEmbed();
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        
        const currentTrack = player.queue.current; // Get the current song being played
        const nextTrack = player.queue.tracks[0]; // Get the next song in the queue
        
        if (!nextTrack) {
            const embed = noSongToSkipEmbed
            return interaction.reply({embeds: [embed]});
        }

        await interaction.deferReply();
        
        // Skip the song
        const skipQueue = interaction.options?.getInteger("skip_queue") || 1;
        await player.skip(skipQueue);
        
        // Create the embed using skipTrackEmbed
        const embed = skipTrackEmbed(currentTrack);

        // Send the embed message
        await interaction.followUp({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        const embed = processingErrorEmbed();
        return interaction.editReply({ embeds: [embed] });
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip a song to go to the next song from the queue.")
        .addIntegerOption(option =>
            option.setName("skip_queue")
                .setDescription("Skip to the next song queue.")
                .setRequired(false)),
    execute: skipTrack,
    skipTrack, // Export the function
};
