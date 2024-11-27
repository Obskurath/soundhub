const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

async function skipTrack({ client, interaction }) {
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
            return interaction.editReply("There are no songs playing right now.");
        }

        const currentTrack = player.queue.current; // Get the current song being played
        const nextTrack = player.queue.tracks[0]; // Get the next song in the queue

        if (!nextTrack) {
            return interaction.editReply("Can't find a song that needs to be skipped.");
        }

        // Create the embed AFTER currentTrack and nextTrack are defined ${player.queue.tracks[0].info.title} 
        const embed = {
            color: "12745742",
            description: player.queue.tracks.length > 0
                ? `🎵 **Song Skipped!**\n\n> **🎶 Now Playing:** \`${player.queue.tracks[0].info.title}\`\n> **⏩ Skipped:** \`${currentTrack.info.title}\`\n\n✨ Enjoy the groove!`
                : `🎵 **Song Skipped!**\n\n> **⏩ Skipped:** \`${player.queue.tracks[0].info.title}\`\n> 🛑 **Queue is empty!**\n\n🎧 Add more tracks to keep the party alive!`,
            fields: [
                {
                    name: "🎼 Queue Status",
                    value: player.queue.tracks.length > 1
                        ? `🎶 **Next Up:** \`${player.queue.tracks[1].info.title}\``
                        : "🛑 **No more tracks queued.**",
                },
            ],
            thumbnail: {
                url: currentTrack.info.thumbnail || "https://example.com/default-thumbnail.png", // Ensure valid URL for the thumbnail
            },
        };

        // Skip the song
        const skipQueue = interaction.options?.getInteger("skip_queue") || 1;
        await player.skip(skipQueue);

        // Send the embed message
        await interaction.followUp({ embeds: [embed] });
    } catch (error) {
        console.error(error);
        return interaction.editReply("An error occurred while processing the command.");
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
