import { createCanvas } from 'canvas';

export class ImageGenerator{
    constructor(dim, text) {
        this.dim = dim
        this.text = text
        this.createImage()
    }

    createImage() {
        const { width, height } = this.dim
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white"; // Set text color
        ctx.font = "30px Arial"; // Set font size and type
        ctx.textAlign = "center"; // Center align the text
        ctx.textBaseline = "middle"; // Middle align the text vertically
        ctx.fillText("Hello, World!", width / 2, height / 2);

        this.buffer = canvas.toBuffer('image/jpeg')
    }

    getBuffer() {
        return this.buffer
    }
}