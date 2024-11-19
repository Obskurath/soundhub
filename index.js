require("dotenv").config();

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, GatewayIntentBits, Collection, Guild, Message, VoiceState } = require("discord.js");
const { Player } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");

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

// PLAYER 

client.player = new Player(client, {
    
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
}

);

// Register the YouTube extractor
const player = new Player()
player.extractors.register(YoutubeiExtractor, {})

client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);
    for (const guildId of guild_ids) {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
            body: commands
        })
            .then(() => console.log(`Added commands to ${guildId}`))
            .catch(console.error);
    }
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
