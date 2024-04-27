import express from 'express'
import { ImageGenerator } from './ImageGenerator.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/image/:dimension.jpg', async (req, res) => {
    try {
        const dimension = req.params.dimension;
        const [width, height] = dimension.split("x").map(val => parseInt(val));

        if (isNaN(width) || isNaN(height)) {
            throw new Error("Invalid dimension format");
        }

        const image = new ImageGenerator({ width: width, height: height }, "hello")
        const buffer = image.getBuffer()

        res.set('Content-Type', 'image/jpeg');
        res.send(buffer);
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log('port listening')
})