const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  // Create the Slash Command with the name "queue" and description
  // This command will display the current song queue
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display the current song queue"),

  // The execute function will be triggered when the user invokes the command
  async execute({ client, interaction }) {
    try {
      // Check if the interaction is part of a guild (server)
      // If there is no guildId, return (don't proceed)
      if (!interaction.guildId) return;

      // Defer the reply to allow time for processing the command
      await interaction.deferReply();

      // Get the voice channel the user is in
      const voiceChannel = interaction.member.voice.channelId;

      // Get the player for the guild
      const player = client.lavalink.getPlayer(interaction.guildId);

      // If no player is found, it means the bot is not connected to a voice channel
      if (!player)
        return interaction.editReply(
          "There is no queue."
        );

      // Check if the user is in the same voice channel as the bot
      if (player.voiceChannelId !== voiceChannel)
        return interaction.editReply(
          "You must be in the same voice channel as the bot."
        );

      // If there is no song currently playing in the queue, send a reply saying so
      if (!player.queue.current)
        return interaction.editReply("There are no songs playing right now.");

      // Create an embed to display the queue
      const embed = {
        color: 12745742,
        title: "Current Song Queue",
        fields: [
          {
            name: "Now Playing",
            value: `🎶 **\`${player.queue.current.info.title}\`**`,
          },
          {
            name: "Up Next",
            value:
              player.queue.tracks.length > 0
                ? player.queue.tracks
                    .map(
                      (track, index) => `${index + 1}. \`${track.info.title}\``
                    )
                    .join("\n")
                : "No more tracks in the queue.",
          },
        ],
      };

      // Reply with the embed
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply(
        "An error occurred while processing the command."
      );
    }
  },
};
