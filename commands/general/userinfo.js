const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Provides information about a user')
        .addUserOption(option => option.setName('target').setDescription('The user to get information about')),
    async execute({ interaction }) {
        const user = interaction.options.getUser('target') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('User Information 👤')
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: '🏷️ Username', value: user.tag, inline: true },
                { name: '🆔 User ID', value: user.id, inline: true },
                { name: '📅 Joined Server', value: member.joinedAt.toDateString(), inline: true },
                { name: '📅 Account Created', value: user.createdAt.toDateString(), inline: true }
            )
            .setFooter({ text: 'User Info', iconURL: user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};