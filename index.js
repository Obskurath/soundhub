// Load environment variables
require("dotenv").config();

// Node.js core modules
const fs = require("node:fs");
const path = require("node:path");

// Discord.js modules
const {
    Client,
    GatewayIntentBits,
    Collection,
    REST
} = require("discord.js");
const { Routes } = require("discord-api-types/v10");

// Lavalink modules
const { LavalinkManager } = require("lavalink-client");

// Configs
const lavaLinkConfig = require("./config/lavalink");
const botConfig = require("./config/bot")

// Event handlers
const PlayerEvents = require("./nodeEvents/Player");
const NodesEvents = require("./nodeEvents/Nodes");

// Utility functions
const { getAllFiles } = require("./utils/fileHelper")

// Commands
const { skipTrack } = require("./commands/music/skip");
const { resumeTrack } = require("./commands/music/resume");
const { pauseTrack } = require("./commands/music/pause");
const { displayQueue } = require("./commands/music/queue");

class Bot {
    constructor() {
        // Create a new client instance
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                // GatewayIntentBits.MessageContent,
            ]
        });

        // Lavalink manager initialization
        this.client.lavalink = new LavalinkManager({
            nodes: lavaLinkConfig.nodes,
            sendToShard: (guildId, payload) => this.client.guilds.cache.get(guildId)?.shard?.send(payload),
            autoSkip: true,
            client: {
                id: botConfig.clientId,
                username: "Soundhub",
            },
        });

        // Initialize commands collection
        this.commands = [];
        this.client.commands = new Collection();

        // Load slash commands
        this.loadCommands();

        // Event listeners
        this.setupEventListeners();
    }

// Load all slash commands
loadCommands() {
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = getAllFiles(commandsPath, ".js");

    for (const file of commandFiles) {
        const command = require(file);
        if (command.data && command.execute) {
            this.client.commands.set(command.data.name, command);
            this.commands.push(command.data.toJSON());
            console.log(`Loaded command: ${command.data.name}`); // Debugging log
        } else {
            console.warn(`Invalid command structure in file: ${file}`); // Debugging log
        }
    }
}

    // Set up event listeners
    setupEventListeners() {
        // Lavalink raw data handling
        this.client.on("raw", d => this.client.lavalink.sendRawData(d));

        // Ready event
        this.client.on("ready", () => {
            this.registerCommands();
            console.log(`Logged in as ${this.client.user.tag}!`);
            this.client.lavalink.init(this.client.user);
        });

        // Interaction event
        this.client.on("interactionCreate", async interaction => {
            if (interaction.isCommand()) {
                const command = this.client.commands.get(interaction.commandName);
                if (!command) return;

                try {
                    await command.execute({ client: this.client, interaction });
                } catch (err) {
                    console.error("Error executing command:", err);
                    await interaction.reply("❌ An error occurred while executing that command");
                }
            } else if (interaction.isButton()) {
                // Handle button interactions
                try {
                    await this.handleButtonInteraction(interaction);
                } catch (err) {
                    console.error("Error handling button interaction:", err);
                    await interaction.reply("❌ An error occurred while handling the button interaction");
                }
            }
        });

        // Player and Node event handling
        PlayerEvents(this.client);
        NodesEvents(this.client);
    }

    // Handle button interactions
    async handleButtonInteraction(interaction) {
        const customId = interaction.customId;
        const guildId = interaction.guildId;
        const player = this.client.lavalink.players.get(guildId);

        switch (customId) {
            case 'resume':
                // Handle resume button
                await resumeTrack({ client: this.client, interaction });
                break;
            case 'pause':
                // Handle pause button
                await pauseTrack({ client: this.client, interaction });
                break;
                case 'skip':
                // Handle skip button
                await skipTrack({ client: this.client, interaction });
                break;
            case 'stop':
                // Handle stop button
                if (player) {
                    player.destroy();
                    await interaction.reply("Why you bully me? :c");
                } else {
                    await interaction.reply("No player found!");
                }
                break;
            case 'queue': 
                //Handle queue button
                await displayQueue({client: this.client, interaction})
                break;
            default:
                await interaction.reply('Unknown button clicked!');
                break;
        }
    }

    // Register the global slash commands
    async registerCommands() {
        const rest = new REST({ version: "10" }).setToken(botConfig.token);
        try {
            await rest.put(Routes.applicationCommands(botConfig.clientId), { body: this.commands });
            console.log("Succesfully loaded all application (/) commands.");
        } catch (error) {
            console.error("Error registering commands:", error);
        }
    }

    // Log the bot in
    login() {
        this.client.login(botConfig.token);
    }
}

// Create a new bot instance and log it in
const bot = new Bot();
bot.login();
