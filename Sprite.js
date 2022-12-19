class Sprite {
    constructor({ position, velocity, image, frames = {max: 1} , sprites}) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
        this.moving = false;
        this.sprites = sprites;
    }

    draw() {
        ctx.drawImage(                     //Player cropped and centered
            this.image,
            this.frames.val * this.width,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max,
            this.image.height,
        );

        if(this.frames.max > 1) {
            if(!this.moving) {
                this.frames.val = 1;
                return
            }
            this.frames.elapsed++
        }
        if(this.frames.elapsed % 10 === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++
            } else {
                this.frames.val = 0;
            }
        }
    }
}

