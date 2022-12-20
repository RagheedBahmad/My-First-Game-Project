class Sprite {
    constructor({ position, image, frames = {max: 1, hold: 10} , sprites, animate = false, isEnemy = false, rotation = 0}) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};
        this.width = this.image.width / this.frames.max;
        this.height = this.image.height;
        this.moving = false;
        this.sprites = sprites;
        this.animate = animate;
        this.opacity = 1;
        this.health = 100;
        this.isEnemy = isEnemy;
        this.rotation = rotation;
    }

    draw() {
        ctx.save();
        ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        ctx.rotate(this.rotation)
        ctx.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2)
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(
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
        ctx.restore();

        if(this.frames.max > 1) {
            if(!this.animate) {
                this.frames.val = 1;
                return
            }
            this.frames.elapsed++
        }
        if(this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++
            } else {
                this.frames.val = 0;
            }
        }
    }

    attack({attack, recipient, renderedSprites}) {
        let healthBar = this.isEnemy ? "#playerHealthBar" : "#enemyHealthBar"
        this.health -= attack.damage
        let rotation = this.isEnemy ? -2.4 : 1

        switch(attack.name) {
            case "Tackle" :
                const tl = gsap.timeline()
                let movementDistance = 10;
                if (this.isEnemy) movementDistance = -10
                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance,
                    duration: 0.1,
                    onComplete: () => {
                        //ENEMY GETS HIT
                        gsap.to(healthBar, {
                            width: this.health + "%"
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.08,
                        })

                        gsap.to(recipient, {
                            opacity: 0.4,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
                break;

            case "VineWhip" :
                break;

            case "Vine Whip" :
                const fireballImage = new Image();
                fireballImage.src = "Assets/Attack Sprites/fireball.png"
                const fireball = new Sprite({
                    position: {
                        x: this.position.x + 50,
                        y: this.position.y + 50
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation
                })
                renderedSprites.splice(1, 0, fireball)

                gsap.to(fireball.position, {
                    x: recipient.position.x + 25,
                    y: recipient.position.y + 50,
                    onComplete: () => {
                        //ENEMY GETS HIT
                        gsap.to(healthBar, {
                            width: this.health + "%"
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 3,
                            duration: 0.08,
                        })

                        gsap.to(recipient, {
                            opacity: 0.4,
                            repeat: 3,
                            yoyo: true,
                            duration: 0.08
                        })
                        renderedSprites.splice(1, 1)
                    }
                })
        }
        }
}

