const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function MusicTime(duration) {
    let minutes = Math.floor(duration / 60000);
    let seconds = Math.floor((duration % 60000) / 1000);

    let formattedSeconds = seconds < 10 ? `0${minutes}` : `${seconds}`;
    return `${minutes}:${formattedSeconds}`
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("seek")
        .setDescription("Fast forward the song to your desired current time.")
        .addStringOption(option =>
            option.setName("time")
                .setDescription("Enter the time in MM:SS format to fast forward the song.")
                .setRequired(true)
        ),

    async execute({ client, interaction }) {
        try {
            // Check if the interaction is part of a guild (server)
            if (!interaction.guildId) return;

            // Defer the reply to allow time for processing the command
            await interaction.deferReply();

            // Get the voice channel the user is in
            const voiceChannel = interaction.member.voice.channelId;

            // If the user is not in a voice channel, reply with an error message
            if (!voiceChannel) return interaction.editReply("Please join the voice channel before using the command.");

            // Retrieve the Lavalink player for the current guild
            const player = client.lavalink.getPlayer(interaction.guildId);

            // If no player is found, it means the bot is not connected to a voice channel
            if (!player) return interaction.editReply("Unfortunately, the bot is not connected to a voice channel.");

            // Check if the user is in the same voice channel as the bot
            if (player.voiceChannelId !== voiceChannel) return interaction.editReply("You must be in the same voice channel as the bot.");

            // If there is no song currently playing in the queue, send a reply saying so
            if (!player.queue.current) return interaction.editReply("There are no songs playing right now.");

            // Retrieve the time entered by the user
            const timeString = interaction.options.getString("time");

            // Split the time string into minutes and seconds
            const timeParts = timeString.split(":");

            // If the time format is incorrect (more than two parts or missing parts)
            if (timeParts.length !== 2 || isNaN(timeParts[0]) || isNaN(timeParts[1])) {
                return interaction.editReply("Please provide the time in the correct format (MM:SS). For example, 1:30 or 0:45.");
            }

            // Parse the minutes and seconds
            let minutes = parseInt(timeParts[0]);
            let seconds = parseInt(timeParts[1]);

            // Validate that the minutes and seconds are within reasonable bounds
            if (minutes < 0 || seconds < 0 || seconds >= 60) {
                return interaction.editReply("Invalid time format. Minutes should be >= 0 and seconds should be between 0 and 59.");
            }

            // Convert the time to seconds (total time in seconds)
            const totalSeconds = minutes * 60 + seconds;

            // Check if the time exceeds the duration of the song
            if (totalSeconds > player.queue.current.info.duration / 1000 || totalSeconds < 0) {
                return interaction.editReply(`The time you're trying to skip exceeds the actual song duration. The song is ${Math.floor(player.queue.current.info.duration / 1000)} seconds long. Please try again.`);
            }

            // Seek to the specified time (convert seconds to milliseconds)
            await player.seek(totalSeconds * 1000);

            // Create an Embed with the time information
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("⏩ Song Position Skipped")
                .setDescription(`Successfully skipped to **${MusicTime(player.position)}**! 🎶`)
                .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })

            // Send the Embed as a reply
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            // Log any errors that occur during the command execution
            console.error(error);
            return interaction.editReply("An error occurred while processing the command.");
        }
    }
};
