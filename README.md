# SoundHub 🎵
> A powerful Discord music bot built with discord.js and lavalink-client.

![SoundHub Preview](./assets/preview.png)


## ✨ Features

- 🎵 High-quality audio playback: Supports high-quality audio streaming from various sources such as YouTube, SoundCloud, Twitch, Spotify, or others.
- 📋 Queue management system: Allows you to easily manage and organize the playback queue for smooth song transitions.
- ⏯️ Rich playback controls: Includes comprehensive controls such as play, pause, skip, volume adjustment, and more.
- 🎨 Beautiful embeds: Displays rich and user-friendly information about the track in a clean and visually appealing way.
- ⚡ Fast and responsive: Provides quick response times and efficient audio streaming without delays or lag.
- 🔐 Permission handling: Manages access and permission settings for users, ensuring that only authorized users can control the playback.
- ☁ Only Lavalink v4.0.0 and above are supported, v3 is not supported.


## 🎮 Commands

| Command    | Description                |
|------------|----------------------------|
| `/play`    | Play a song                |
| `/pause`   | Pause track                |
| `/resume`  | Resume playback            |
| `/stop`    | Stop playing               |
| `/skip`    | Skip track                 |
| `/queue`   | View queue                 |
| `/leave`   | Leave Channel              |
| `/loop`    | Repeat Song                |
| `/volume`  | Adjust the music volume    |
| `/seek`    | Fast forward the song time |
| `/filters` | Command to select filters  |
| `/help`    | Displays a list of commands|
| `/info`    | Provides bot/server info   |
| `/invite`  | Provides an invite link    |
| `/ping`    | Replies with Pong!🏓       |
| `/uptime`  | Shows bot uptime           |
| `/userinfo`| Provides user information  |

## 🚀 Setup

### Prerequisites
1. Node.js (Required)
   - Compatible with Node.js v18.x.x and above
   - Tested on Node.js v23.1.0
2. Java JDK 17+ (for Lavalink server)
3. Discord Bot Token
4. Lavalink Server v4.0.0+

### Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to the "Bot" tab and click "Add Bot"
4. Copy the bot token (you'll need this for the `.env` file)
5. Under "Privileged Gateway Intents", enable:
   - Server Members Intent
   - Message Content Intent
   - Voice State Intent
6. Go to "OAuth2" → "URL Generator"
   - Select "bot" and "applications.commands" scopes
   - Select required permissions:
     - Send Messages
     - Connect
     - Speak
     - Use Voice Activity
     - Use Slash Commands
7. Copy the generated URL and use it to invite the bot to your server

### Lavalink Server Setup
1. Download Lavalink v4.0.0 or higher from [GitHub Releases](https://github.com/lavalink-devs/Lavalink/releases)
2. Setup Lavalink Configuration
   1. Create a new file named `application.yml` in the same directory as your `Lavalink.jar`
   2. Copy the configuration below or download from [official example](https://github.com/lavalink-devs/Lavalink/blob/master/LavalinkServer/application.yml.example) (Recommended)

```yaml
# Basic Lavalink configuration
server:
  port: 2333
  address: 127.0.0.1
lavalink:
  server:
    password: "youshallnotpass"  # Important: Change this password
    sources:
      youtube: true    # Enable YouTube support
      soundcloud: true # Enable SoundCloud support
    bufferDurationMs: 400
    youtubePlaylistLoadLimit: 6
```

3. Start Lavalink server:
```bash
java -jar Lavalink.jar
```

### Installation

```bash
# Check your Node.js version first
node --version # Should be above v18.x.x

# If needed, install Node.js v18+ from:
# https://nodejs.org/download/release/v18.19.0/

# Alternatively, use nvm (Node Version Manager) to install Node.js v18+:
nvm install latest
nvm use latest
```

### Bot Installation
```bash
# Clone the repository
git clone https://github.com/Obskurath/soundhub.git
cd soundhub

# Install dependencies
npm install
```

### Configuration
Create a `.env` file:
```bash
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id  
GUILD_ID=your_guild_id
LAVALINK_HOST=your_host
LAVALINK_PORT=the_port
LAVALINK_PASSWORD=password
```

### Start
```bash
node index.js
```

## 🛠️ Tech Stack
- discord.js v14
- Node.js v18+
- lavalink-client v2.4.1

## 🤝 Contributing
1. Fork repository
2. Create branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
## 💬 Support
Open an issue
