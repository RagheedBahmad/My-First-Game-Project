class Sprite {
    constructor({ position, velocity, image, frames = {max: 1} }) {
        console.log("reached")
        this.position = position;
        this.image = image;
        this.frames = frames;
        // this.image.onLoad = () => {
            this.width = this.image.width / this.frames.max;
            this.height = this.image.height;

            console.log(this.width);
            console.log(this.height);
        // }
    }

    draw() {
        ctx.drawImage(                     //Player cropped and centered
            this.image,
            0,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        );
    }
}

