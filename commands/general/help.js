const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of available commands'),
    async execute({ client, interaction }) {
        // Get the available commands and their descriptions
        const commands = client.commands.map(cmd => `\`${cmd.data.name}\`: ${cmd.data.description}`).join('\n');

        const embed = new EmbedBuilder()
            .setColor(12745742) 
            .setTitle('Help - List of Commands')
            .setDescription('Here are the available commands:')
            .addFields({ name: 'Commands', value: commands })
            .setFooter({ text: 'Use /command to execute a command' });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};
