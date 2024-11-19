# SoundHub 🎵

> A powerful Discord music bot built with discord.js and discord-player.

---

## ✨ Features

- 🎵 **High-quality YouTube playback**
- 📋 **Queue management system**
- ⏯️ **Rich playback controls**
- 🎨 **Beautiful embeds**
- ⚡ **Fast and responsive**
- 🔐 **Permission handling**

---

## 🎮 Commands

| Command    | Description        |
|------------|--------------------|
| `/play`    | Play a song        |
| `/pause`   | Pause track        |
| `/resume`  | Resume playback    |
| `/stop`    | Stop playing       |
| `/skip`    | Skip track         |
| `/queue`   | View queue         |
| `/exit`    | Disconnect bot     |

---

## 🚀 Setup

### Prerequisites

- Node.js 18+
- Discord Bot Token
- Discord Server

### Installation

```bash
git clone https://github.com/yourusername/soundhub.git
cd soundhub
npm install
```

### Configuration
Create a .env file:
```bash
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_client_id
GUILD_ID=your_server_id
```

### Start
```bash
node index.js
```


## 🛠️ Tech Stack
- discord.js v14
- discord-player v6
- Node.js v18+
- YouTube API


## 🤝 Contributing
1. Fork repository
2. Create branch (git checkout -b feature/amazing-feature)
3. Commit changes (git commit -m 'Add feature')
4. Push branch (git push origin feature/amazing-feature)
5. Open Pull Request


## 📝 License
MIT License - see LICENSE file`


## 💬 Support
Open an issue

## 🎨 Preview

### Command Interactions
```css
/play 🎵 Shape of You
> Now Playing: Ed Sheeran - Shape of You
> Duration: 3:54 | Requested by @user

/queue
> Current Queue (3 tracks):
> 1. 🎵 Shape of You - Ed Sheeran (NOW PLAYING)
> 2. 🎵 Blinding Lights - The Weeknd
> 3. 🎵 Stay - The Kid LAROI, Justin Bieber
```

### Bot Responses

// Now Playing Embed
+-----------------------+
|     🎵 Now Playing    |
|-----------------------|
| Shape of You          |
| Ed Sheeran           |
|                      |
| 🕐 1:24 ▰▰▰▱▱▱▱ 3:54 |
| 👤 Requested by User  |
+-----------------------+

// Queue Embed
+-----------------------+
|    📑 Queue List      |
|-----------------------|
| 1. Shape of You      |
| 2. Blinding Lights   |
| 3. Stay              |
|                      |
| Total Duration: 11:42|
+-----------------------+


## Features Preview
🎨 Colorful embeds with song info
📊 Real-time progress bars
🎵 Thumbnail previews
📱 Mobile-friendly display
⚡ Fast response times