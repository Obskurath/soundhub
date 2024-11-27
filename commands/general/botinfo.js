const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Provides information about the bot'),
    async execute({ client, interaction }) {
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Bot Information 🤖')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '🏷️ Bot Name', value: client.user.username, inline: true },
                { name: '🆔 Bot ID', value: client.user.id, inline: true },
                { name: '🌐 Servers', value: client.guilds.cache.size.toString(), inline: true },
                { name: '👥 Users', value: client.users.cache.size.toString(), inline: true },
                { name: '📅 Created On', value: client.user.createdAt.toDateString(), inline: true }
            )
            .setFooter({ text: 'Bot Info', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};