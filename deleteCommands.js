const { REST } = require("discord.js");
const { Routes } = require("discord-api-types/v10");
require("dotenv").config();

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log("Started deleting application (/) commands.");

        // Delete all global commands
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: [] }
        );

        // Delete all guild-specific commands
        const guild_ids = process.env.GUILD_ID; // Add your guild IDs here
        for (const guildId of guild_ids) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                { body: [] }
            );
        }

        console.log("Successfully deleted all application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();