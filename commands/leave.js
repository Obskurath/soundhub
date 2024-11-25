const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("leave").setDescription("Destroy the song and leave the voice channel"),
    async execute ({ client, interaction }) {
        try {
            if (!interaction.guildId) return;

            await interaction.deferReply();

            const voiceChannel = interaction.member.voice.channelId;
            if (!voiceChannel) return interaction.editReply("Please join the voice channel before using the command.")
            
            const player = client.lavalink.getPlayer(interaction.guildId);
            if (!player) return interaction.editReply("Unfortunately, the bot is not connected to the voice channel you are on.")
            if (player.voiceChannelId !== voiceChannel) return interaction.editReply("You must be in the same voice channel as the bot.")
            if (!player.queue.current) return interaction.editReply("There are no songs playing right now.")

            await player.destroy();

            await interaction.editReply("exited the voice channel If you want to play the song again, you can order me now.")

        } catch (error) {
            console.error(error)
        }
    }
}