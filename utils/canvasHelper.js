const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs')
const fontPath = './assets/fonts/JetBrainsMono-Regular.ttf';

// Register fonts
if (fs.existsSync(fontPath)) {
    registerFont(fontPath, { family: 'JetBrains Mono' });
} else {
    console.error('The font does not exists on the specified path.');
}

// Cache to store images based on track info
const cache = {};

// Function to get the average color of an image
async function getAverageColor(image) {
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    // Get pixel data
    const pixels = ctx.getImageData(0, 0, image.width, image.height);
    const data = pixels.data;

    let r = 0, g = 0, b = 0;
    const totalPixels = data.length / 4;

    // Calculate average color
    for (let i = 0; i < data.length; i += 4) {
        r += data[i];     // Red
        g += data[i + 1]; // Green
        b += data[i + 2]; // Blue
    }

    r = Math.floor(r / totalPixels);
    g = Math.floor(g / totalPixels);
    b = Math.floor(b / totalPixels);

    return `rgb(${r}, ${g}, ${b})`;
}

async function createNowPlayingImage(currentTrack) {
    // Check if the image is already cached
    const trackId = currentTrack.info.title + currentTrack.info.author; // Unique key based based on track title and author
    if (cache[trackId]) {
        // console.log("Retuning cache image for track:", currentTrack.info.title);
        return cache[trackId]; // Return cached image
    }

    const canvas = createCanvas(900, 250);
    const ctx = canvas.getContext('2d');

    // Draw black rectangle
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw thumbnail
    const thumbnailUrl = currentTrack.info.artworkUrl || 'https://example.com/default-thumbnail.png';
    const thumbnail = await loadImage(thumbnailUrl);
    const thumbnailX = 20;
    const thumbnailY = 20;
    const thumbnailSize = 180;

    // Get the average color of the thumbnail
    const glowColor = await getAverageColor(thumbnail);

    // Configure shadow for the glow effect
    ctx.save(); // Save the current state of the canvas
    ctx.shadowBlur = 20; // Adjust this value for more/less blur
    ctx.shadowColor = glowColor; // Color of the glow
    ctx.drawImage(thumbnail, thumbnailX, thumbnailY, thumbnailSize + 30, thumbnailSize + 30); // Slightly larger for the glow effect
    ctx.restore(); // Restore the previous state to prevent the shadow from affecting other drawings

    // Add a small border around the thumbnail
    ctx.strokeStyle = glowColor; // Border color
    ctx.lineWidth = 5; // Border width
    ctx.strokeRect(thumbnailX - 5, thumbnailY - 5, thumbnailSize + 30 + 10, thumbnailSize + 30 + 10) // Add border

    // Draw song title and author
    ctx.fillStyle = 'white';
    ctx.font = '30px "JetBrains Mono", sans-serif';
    ctx.fillText(currentTrack.info.title, 290, 100);
    ctx.fillStyle = 'gray';
    ctx.font = '22px "JetBrains Mono"';
    ctx.fillText(currentTrack.info.author || 'Unknown Author', 290, 140);

    const imageBuffer = canvas.toBuffer();
    cache[trackId] = imageBuffer;

    return imageBuffer;
}

module.exports = { createNowPlayingImage, getAverageColor };