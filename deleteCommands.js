const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
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
        const guild_ids = ["1304884326285971539"]; // Add your guild IDs here
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