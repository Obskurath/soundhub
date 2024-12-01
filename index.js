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
                GatewayIntentBits.GuildEmojisAndStickers
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
            options: {
                requestTimeout: 10000 // Increase timeout to 10 seconds
            }
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
                    await interaction.reply({ content: "Why you bully me? :c", ephemeral: true });
                } else {
                    await interaction.reply({ content: "No player found!", ephemeral: true });
                }
                break;
            case 'queue':
                //Handle queue button
                await displayQueue({ client: this.client, interaction })
                break;
            case 'volume_up':
                if (player) {
                    let currentVolume = player.volume;
                    if (currentVolume < 100) {
                        player.setVolume(currentVolume + 10);
                        await interaction.reply({ content: `Volume increased to ${currentVolume + 10}%`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: "Volume is already at maximum!", ephemeral: true });
                    }
                } else {
                    await interaction.reply({ content: "No player found!", ephemeral: true });
                }
                break;
            case 'volume_down':
                if (player) {
                    let currentVolume = player.volume;
                    if (currentVolume > 0) {
                        player.setVolume(currentVolume - 10);
                        await interaction.reply({ content: `Volume decreased to ${currentVolume - 10}%`, ephemeral: true });
                    } else {
                        await interaction.reply({ content: "Volume is already at minimum!", ephemeral: true });
                    }
                } else {
                    await interaction.reply({ content: "No player found!", ephemeral: true });
                }
                break;
            case 'clear_queue':
                if (player) {
                    player.queue.tracks = [];
                    await interaction.reply({ content: "The queue has been cleared!", ephemeral: true });
                } else {
                    await interaction.reply({ content: "No player found!", ephemeral: true });
                }
                break;
            case 'shuffle_queue':
                // Handle shuffle queue button
                if (player) {
                    const tracks = player.queue.tracks;
                    if (tracks.length > 0) {
                        // Shuffle the tracks in the queue
                        for (let i = tracks.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1));
                            [tracks[i], tracks[j]] = [tracks[j], tracks[i]]; // Swap tracks
                        }
                        await interaction.reply({ content: "The queue has been shuffled!", ephemeral: true });
                    } else {
                        await interaction.reply({ content: "There are no tracks in the queue to shuffle.", ephemeral: true });
                    }
                } else {
                    await interaction.reply({ content: "No player found!", ephemeral: true });
                }
                break;
            default:
                await interaction.reply({ content: 'Unknown button clicked!', ephemeral: true });
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
