# Custom Emojis Setup

## 🎨 Installing Custom Emojis

To enhance the visual appeal of your bot's messages, you can add custom emojis. Follow these steps to install and set up custom emojis:

### Step 1: Upload Custom Emojis to Your Discord Server

1. Open your Discord server.
2. Go to the server settings by clicking on the server name at the top left and selecting "Server Settings."
3. Navigate to the "Emoji" tab.
4. Click the "Upload Emoji" button and select the PNG files you want to use as custom emojis.
5. Give each emoji a unique name (e.g., `warning`, `check`, `error`).

### Step 2: Get the Emoji IDs

1. After uploading the emojis, right-click on each emoji and select "Copy Link."
2. The URL will look something like this: `https://cdn.discordapp.com/emojis/123456789012345678.png?v=1`
3. The number in the URL (e.g., `123456789012345678`) is the emoji ID. Note down the IDs for each emoji.

### Step 3: Update `config/emojis.json`

1. Open the `config/emojis.json` file in your project.
2. Update the file with the emoji IDs you noted down. The file should look like this: