const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides information about the bot or server'),
    async execute({ client, interaction }) {
        const guild = interaction.guild;
        const embed = new EmbedBuilder()
            .setColor(0x0099ff) 
            .setTitle('Bot & Server Information')
            .setDescription('Here is some detailed information about the bot and the server:')
            .setThumbnail(client.user.displayAvatarURL())
            .addFields(
                { name: '🤖 Bot Name', value: client.user.username, inline: true },
                { name: '🆔 Bot ID', value: client.user.id, inline: true },
                { name: '🌐 Server Name', value: guild.name, inline: true },
                { name: '🆔 Server ID', value: guild.id, inline: true },
                { name: '👥 Total Members', value: guild.memberCount.toString(), inline: true },
                { name: '📅 Created On', value: guild.createdAt.toDateString(), inline: true },
                { name: '👑 Owner', value: `<@${guild.ownerId}>`, inline: true }
            )
            .setFooter({ text: 'Thank you for using our bot!', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};