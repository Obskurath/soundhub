const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Provides an invite link for the bot'),
    async execute({ client, interaction }) {
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff) 
            .setTitle('Invite Me to Your Server! 🎉')
            .setDescription('Click the link below to invite the bot to your server:')
            .setThumbnail(client.user.displayAvatarURL()) 
            .addFields(
                { name: 'Invite Link', value: `[Click here to invite](${inviteLink})`, inline: false },
                { name: 'Why Invite Me?', value: 'I can help play music in your server,!', inline: false },
                // { name: 'Support', value: '[Join our support server](https://discord.gg/your-support-server)', inline: false }
            )
            .setImage('https://example.com/your-banner-image.png') 
            .setFooter({ text: 'Thank you for using our bot!', iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};