require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    Collection,
    REST
} = require("discord.js");

const { Routes } = require("discord-api-types/v10");
const { LavalinkManager } = require("lavalink-client");

const fs = require("node:fs");
const path = require("node:path");
const PlayerEvents = require("./nodeEvents/Player");
const NodesEvents = require("./nodeEvents/Nodes");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        // GatewayIntentBits.MessageContent,
    ]
});

// create instance lavalink
client.lavalink = new LavalinkManager({
    // Configure Lavalink nodes (a list of nodes that Lavalink can connect to)
    nodes: [
        {
            authorization: process.env.LAVALINK_PASSWORD, // // Lavalink authorization key (must be set according to your Lavalink server configuration)
            host: process.env.LAVALINK_HOST, // // The host address of your Lavalink node (e.g., 'localhost' or an external server address)
            port: parseInt(process.env.LAVALINK_PORT), // Port number that Lavalink is running on (default is 2333)
            id: "Soundhub", // // Unique identifier for the Lavalink node (useful if you're running multiple nodes, typically set to 'default' if only one node)
        }
    ],
     // Function that sends messages to the appropriate shard (necessary for large bots with multiple shards)
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),

     // Auto skip the track after it's finished playing (this will automatically play the next track in the queue)
    autoSkip: true,

     // Client configuration, containing bot-specific details like ID and username
    client: {
        id: process.env.CLIENT_ID, // The bot's client ID fetched from environment variables (keep sensitive information out of the codebase)
        username: "Soundhub",  // The bot's username (could be left empty if you don't need to specify it explicitly)
    },
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

client.on("raw", d => client.lavalink.sendRawData(d)); // send raw data to lavalink-client to handle stuff

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
    client.lavalink.init(client.user)
});

PlayerEvents(client);
NodesEvents(client);

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

/**
 * // Example Bot (messageCreate) No Slash
 * 
 * client.on("messageCreate", async message => {
    if (message.author.bot) return;

    // Check if the command is !play and the user has provided a query
    if (message.content.startsWith("!play")) {
        const args = message.content.slice(6).trim(); // Extract the message content after the !play command
        if (!args) {
            return message.reply("Please provide a song query or URL, e.g., !play <song name or URL>");
        }

        // Check if the guildId, voiceChannelId, and textChannelId are valid
        const guildId = message.guild.id; // Use guildId from the message
        const voiceChannelId = message.member.voice.channel ? message.member.voice.channel.id : null;
        const textChannelId = message.channel.id;

        if (!voiceChannelId) {
            return message.reply("Please join a voice channel before playing a song.");
        }

        // Create a player or get the existing player for the guild
        const player = client.lavalink.getPlayer(guildId) || await client.lavalink.createPlayer({
            guildId: guildId,
            voiceChannelId: voiceChannelId,
            textChannelId: textChannelId,
            selfDeaf: true,
            selfMute: false,
            volume: 100, // Default volume
        });

        const connected = player.connected;

        if (!connected) await player.connect();

        // Search for the song based on the user's query
        const response = await player.search({ query: args, source: "scsearch" }, message.author);

        if (!response || !response.tracks?.length) {
            return message.reply({ content: `No tracks found for: ${args}`, ephemeral: true });
        }

        // Add the first track to the player's queue
        const track = response.tracks[0];
        await player.queue.add(track);

        // If the player is not playing, start the playback
        if (!player.playing) {
            await player.play();
            message.reply(`Now playing: ${track.info.title}`);
        }
    }
});

 * 
 */

client.login(process.env.DISCORD_TOKEN);
