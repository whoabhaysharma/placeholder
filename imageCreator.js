import express from 'express'
import { ImageGenerator } from './ImageGenerator.js';
import Ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import path from 'path';
import { promises as fsPromises } from 'fs';
const { unlink } = fsPromises;

const app = express();
const port = 3000;

app.use(express.json());

const ffmpegPath = 'ffmpeg/ffmpeg'; // Specify the path to ffmpeg binary

Ffmpeg.setFfmpegPath(ffmpegPath);
app.get('/video/:dimension.mp4', async (req, res) => {
    try {
        const dimension = req.params.dimension;
        const [width, height] = dimension.split("x").map(val => parseInt(val));

        if (isNaN(width) || isNaN(height)) {
            throw new Error("Invalid dimension format");
        }

        let buffers = []

        for (let i = 0; i < 10; i++){
            const image = new ImageGenerator({ width: width, height: height }, i+1)
            const buffer = image.getBuffer()
            buffers.push(buffer)
        }


        const imageBuffers = buffers

        const imageStream = new Readable();
        imageStream._read = () => { };
        imageBuffers.forEach(buffer => {
            imageStream.push(buffer);
        });
        imageStream.push(null);

        Ffmpeg()
            .input(imageStream)
            .inputFormat('image2pipe', 'mjpeg')
            .inputFPS(1)
            .outputOptions('-c:v', 'libx264')
            .outputOptions('-r', '1')
            .outputOptions('-pix_fmt', 'yuv420p')
            .outputOptions('-movflags', 'faststart')
            .output('output.mp4')
            .on('end', () => {
                console.log('Video generation completed');
                const videoPath = path.join(path.resolve(), 'output.mp4');
                res.sendFile(videoPath, (err) => {
                    if (err) {
                        console.error('Error sending file:', err);
                    } else {
                        // File sent successfully, now remove it
                        unlink(videoPath, (unlinkErr) => {
                            if (unlinkErr) {
                                console.error('Error removing file:', unlinkErr);
                            } else {
                                console.log('File removed successfully.');
                            }
                        });
                    }
                });
            })
            .on('error', (err) => {
                console.error('Error generating video:', err);
                res.status(500).send('Internal Server Error');
            })
            .run();


        // res.set('Content-Type', 'image/jpeg');
        // res.send(buffer);
    } catch (error) {
        console.error("Error generating image:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log('port listening')
})