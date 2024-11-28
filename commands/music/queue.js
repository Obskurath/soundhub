const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

async function displayQueue({ client, interaction }) {
  try {
    if (!interaction.guildId) return;

    await interaction.deferReply();

    const voiceChannel = interaction.member.voice.channelId;

    const player = client.lavalink.getPlayer(interaction.guildId);

    if (!player)
      return interaction.editReply(
        "There is no queue."
      );

    if (player.voiceChannelId !== voiceChannel)
      return interaction.editReply(
        "You must be in the same voice channel as the bot."
      );

    if (!player.queue || !player.queue.current)
      return interaction.editReply("There are no songs playing right now.");

    const currentTrack = player.queue.current;
    const tracksInQueue = player.queue.tracks || [];

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
            tracksInQueue.length > 0
              ? tracksInQueue
                .map(
                  (track, index) => `${index + 1}. \`${track.info.title}\``
                )
                .join("\n")
              : "No more tracks in the queue.",
        },
      ],
    };

    // Create action row with buttons
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('clear_queue')
          .setLabel('Clear Queue')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('shuffle_queue')
          .setLabel('Shuffle Queue')
          .setStyle(ButtonStyle.Primary)
      );

    // Reply with the embed
    await interaction.editReply({ embeds: [embed], components: [row] });
  } catch (error) {
    console.error(error);
    return interaction.editReply(
      "An error occurred while processing the command."
    );
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Display the current song queue"),
  execute: displayQueue,
  displayQueue,
}
