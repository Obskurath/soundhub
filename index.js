require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    Collection,
    REST
} = require("discord.js");

const { Routes } = require("discord-api-types/v10");

const fs = require("node:fs");
const path = require("node:path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// LOAD ALL THE SLASH COMMANDS (/)
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.on("ready", () => {
    // Note: The version has been updated to "10" because Discord API v9 has been deprecated.
    // Discord.js v14 and above now supports version 10 of the API, and it is required for compatibility.
    // Upgrading to version 10 ensures better security and access to the latest features of Discord API.
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
    rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
    })
        .then(() => console.log('Successfully registered global commands!'))
        .catch(console.error);
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute({ client, interaction });
    } catch (err) {
        console.error("Error executing command:", err);
        await interaction.reply("❌ An error occurred while executing that command");
    }
});

client.login(process.env.DISCORD_TOKEN);
