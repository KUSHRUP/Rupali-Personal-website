const fs = require('fs');
const path = require('path');

// Simple PNG dimension reader
function getPngDimensions(filePath) {
    const buffer = fs.readFileSync(filePath);
    // PNG signature check
    if (buffer.toString('ascii', 1, 4) !== 'PNG') {
        throw new Error('Not a valid PNG file');
    }
    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);
    return { width, height };
}

try {
    const imgPath = path.join(__dirname, '..', 'public', 'Rupali photos-assets', 'download.png');
    console.log('Image dimensions:', getPngDimensions(imgPath));
} catch (err) {
    console.error('Error reading PNG:', err);
}
