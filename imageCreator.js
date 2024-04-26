const express = require('express');
const { createCanvas } = require('canvas');

const app = express();

app.get('/:dimensions.jpg', (req, res) => {
    const { dimensions } = req.params;
    const [width, height] = dimensions.split('x');

    // Create a canvas with specified width and height
    const canvas = createCanvas(parseInt(width), parseInt(height));
    const ctx = canvas.getContext('2d');

    // Fill the canvas with white color
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, parseInt(width), parseInt(height));

    // Convert canvas to a PNG buffer and send it as a response
    const buffer = canvas.toBuffer();
    res.set('Content-Type', 'image/png');
    res.send(buffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
