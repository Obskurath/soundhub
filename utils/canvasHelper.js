const { createCanvas, loadImage, registerFont } = require('canvas');

// Register fonts
registerFont('./assets/fonts/JetBrainsMono-Regular.ttf', { family: 'JetBrainsMono' });
registerFont('./assets/fonts/JetBrainsMono-Italic.ttf', { family: 'JetBrainsMono', style: 'italic' });
registerFont('./assets/fonts/JetBrainsMono-Bold.ttf', { family: 'JetBrainsMono', weight: 'bold' });

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
    const canvas = createCanvas(900, 250);
    const ctx = canvas.getContext('2d');

    // Draw black rectangle
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load and draw thumbnail
    const thumbnailUrl = currentTrack.info.artworkUrl || 'https://example.com/default-thumbnail.png';
    const thumbnail = await loadImage(thumbnailUrl);
    ctx.drawImage(thumbnail, 20, 20, 180, 180);

    // Get the average color of the thumbnail
    const glowColor = await getAverageColor(thumbnail);

    // Configure shadow for the glow effect
    ctx.save(); // Save the current state of the canvas
    ctx.shadowBlur = 20; // Adjust this value for more/less blur
    ctx.shadowColor = glowColor; // Color of the glow
    ctx.drawImage(thumbnail, 20, 20, 210, 210);
    ctx.restore(); // Restore the previous state to prevent the shadow from affecting other drawings


    // Draw song title and author
    ctx.fillStyle = 'white';
    ctx.font = '30px JetBrainsMono';
    ctx.fillText(currentTrack.info.title, 290, 100);
    ctx.fillStyle = 'gray';
    ctx.font = '22px JetBrainsMono';
    ctx.fillText(currentTrack.info.author || 'Unknown Author', 290, 140);

    return canvas.toBuffer();
}

module.exports = { createNowPlayingImage, getAverageColor };