const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    // Create the Slash Command with the name "leave" and description
    // This command will destroy the song and make the bot leave the voice channel
    data: new SlashCommandBuilder()
        .setName("leave")
        .setDescription("Destroy the song and leave the voice channel"),

    // The execute function will be triggered when the user invokes the command
    async execute({ client, interaction }) {
        try {
            // Check if the interaction is part of a guild (server)
            // If there is no guildId, return (don't proceed)
            if (!interaction.guildId) return;

            // Defer the reply to allow time for processing the command
            await interaction.deferReply({ephemeral: true});

            // Get the voice channel the user is in
            const voiceChannel = interaction.member.voice.channelId;

            // If the user is not in a voice channel, reply with an error message
            if (!voiceChannel) return interaction.editReply({content: "Please join the voice channel before using the command.", ephemeral: true});

            // Retrieve the Lavalink player for the current guild
            const player = client.lavalink.getPlayer(interaction.guildId);

            // If no player is found, it means the bot is not connected to a voice channel
            if (!player) return interaction.editReply({content:"Unfortunately, the bot is not connected to the voice channel you are on.", ephemeral: true});

            // Check if the user is in the same voice channel as the bot
            if (player.voiceChannelId !== voiceChannel) return interaction.editReply({content:"You must be in the same voice channel as the bot.", ephemeral: true});

            // If there is no song currently playing in the queue, send a reply saying so
            if (!player.queue.current) return interaction.editReply({content: "There are no songs playing right now.", ephemeral: true});

            // Destroy the player (stop the song and disconnect from the voice channel)
            await player.destroy();

            // Reply to the user saying that the bot has left the voice channel
            await interaction.editReply({content:"Exited the voice channel. If you want to play the song again, you can order me now.", ephemeral: false});
        } catch (error) {
            // Log any errors that occur during the command execution
            console.error(error);
            return interaction.editReply({content: "An error occurred while processing the command.", ephemeral: true});
        }
    }
};
