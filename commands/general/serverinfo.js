const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Provides information about the server'),
    async execute({ interaction }) {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Server Information 🌐')
            .setThumbnail(guild.iconURL())
            .addFields(
                { name: '🏷️ Server Name', value: guild.name, inline: true },
                { name: '🆔 Server ID', value: guild.id, inline: true },
                { name: '👥 Total Members', value: guild.memberCount.toString(), inline: true },
                { name: '📅 Created On', value: guild.createdAt.toDateString(), inline: true },
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true }
            )
            .setFooter({ text: 'Server Info', iconURL: guild.iconURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};