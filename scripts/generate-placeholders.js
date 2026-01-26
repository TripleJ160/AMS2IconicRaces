const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create Senna placeholder (red theme)
sharp({
  create: {
    width: 1920,
    height: 1080,
    channels: 4,
    background: { r: 220, g: 0, b: 0, alpha: 1 }
  }
})
  .composite([{
    input: Buffer.from(
      `<svg width="1920" height="1080">
        <rect width="1920" height="1080" fill="rgb(10,10,10)"/>
        <rect width="1920" height="1080" fill="url(#grad1)" opacity="0.8"/>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(220,0,0);stop-opacity:0.6" />
            <stop offset="100%" style="stop-color:rgb(10,10,10);stop-opacity:1" />
          </linearGradient>
        </defs>
        <text x="50%" y="50%" font-family="Arial" font-size="120" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
          SENNA
        </text>
        <text x="50%" y="60%" font-family="Arial" font-size="60" fill="rgb(255,215,0)" text-anchor="middle" dominant-baseline="middle">
          Donington 1993
        </text>
      </svg>`
    ),
    top: 0,
    left: 0
  }])
  .jpeg({ quality: 90 })
  .toFile(path.join(imagesDir, 'senna-donington.jpg'))
  .then(() => console.log('✓ Created senna-donington.jpg'))
  .catch(err => console.error('Error creating Senna image:', err));

// Create Clark placeholder (yellow theme)
sharp({
  create: {
    width: 1920,
    height: 1080,
    channels: 4,
    background: { r: 255, g: 215, b: 0, alpha: 1 }
  }
})
  .composite([{
    input: Buffer.from(
      `<svg width="1920" height="1080">
        <rect width="1920" height="1080" fill="rgb(10,10,10)"/>
        <rect width="1920" height="1080" fill="url(#grad2)" opacity="0.8"/>
        <defs>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgb(255,215,0);stop-opacity:0.5" />
            <stop offset="100%" style="stop-color:rgb(10,10,10);stop-opacity:1" />
          </linearGradient>
        </defs>
        <text x="50%" y="50%" font-family="Arial" font-size="120" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">
          CLARK
        </text>
        <text x="50%" y="60%" font-family="Arial" font-size="60" fill="rgb(255,215,0)" text-anchor="middle" dominant-baseline="middle">
          Spa 1970
        </text>
      </svg>`
    ),
    top: 0,
    left: 0
  }])
  .jpeg({ quality: 90 })
  .toFile(path.join(imagesDir, 'clark-spa.jpg'))
  .then(() => console.log('✓ Created clark-spa.jpg'))
  .catch(err => console.error('Error creating Clark image:', err));
