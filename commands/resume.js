const { SlashCommandBuilder } = require("discord.js");

async function resumeTrack({ client, interaction }) {
    try {
        if (!interaction.guildId) return;

        await interaction.deferReply();

        const voiceChannel = interaction.member.voice.channelId;

        if (!voiceChannel) {
            return interaction.editReply("Please join the voice channel before using the command.");
        }

        const player = client.lavalink.getPlayer(interaction.guildId);

        if (!player) {
            return interaction.editReply("Unfortunately, the bot is not connected to the voice channel you are on.");
        }

        if (player.voiceChannelId !== voiceChannel) {
            return interaction.editReply("You must be in the same voice channel as the bot.");
        }

        if (!player.queue.current) {
            return interaction.editReply("There is no song currently playing.");
        }

        if (player.paused) {
            await player.pause(false);
            await interaction.editReply("Resumed playing!");
        } else {
            await interaction.editReply("The player is already playing!");
        }
    } catch (error) {
        console.error(error);
        return interaction.editReply("An error occurred while processing the command.");
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resume the currently playing song."),
    execute: resumeTrack,
    resumeTrack, // Export the function
};
