const { Client, GatewayIntentBits, Collection } = require('discord.js') 
require('dotenv').config()

const client = new Client ({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ]
})

client.commands = new Collection();

const fs = require("fs");

const functions = fs
  .readdirSync("./src/functions")
  .filter((file) => file.endsWith(".js"));

const commandFolders = fs.readdirSync("./src/commands");

(async () => {
  for (file of functions) {
    require(`./functions/${file}`)(client);
  }
  client.slashCommands(commandFolders, "./src/commands");
  client.login(process.env.DISCORD_TOKEN);
})();

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command! 💀🚫",
      ephemeral: true,
    });
  }
});







