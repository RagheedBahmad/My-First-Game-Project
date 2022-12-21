class Monster extends Sprite {
    constructor({position, image, frames = {max: 1, hold: 10} , sprites, animate = false, rotation = 0, name, isEnemy = false, attacks}) {
        super({
            position, image, frames, sprites, animate, rotation
        });
        this.health = 100;
        this.isEnemy = isEnemy;
        this.name = name;
        this.attacks = attacks
    }

    faint() {
        document.querySelector("#dialogueBox").innerHTML = this.name + " fainted!!"
        gsap.to(this.position, {
            y: this.position.y + 20
        })
        gsap.to(this, {
            opacity: 0
        })
        audio.victory.play()
        audio.battle.stop()
    }


    attack({attack, recipient, renderedSprites}) {
        document.querySelector("#dialogueBox").style.display = "block"
        document.querySelector("#dialogueBox").innerHTML = this.name + " used " + attack.name

        let healthBar = this.isEnemy ? "#playerHealthBar" : "#enemyHealthBar"
        recipient.health -= attack.damage
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
                        audio.tackleHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + "%"
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

            case "Fireball" :
                audio.initFireball.play()
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
                        audio.fireballHit.play()
                        gsap.to(healthBar, {
                            width: recipient.health + "%"
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
                break;

            case "Razor Leaf" :
                const razorLeafImage = new Image();
                razorLeafImage.src = "Assets/Attack Sprites/Razor Leaf.png"
                const razorLeaf = new Sprite({
                    position: {
                        x: this.position.x + 50,
                        y: this.position.y + 50
                    },
                    image: razorLeafImage,
                    frames: {
                        max: 6,
                        hold: 30
                    },
                    animate: true,
                    rotation
                })
                renderedSprites.splice(1, 0, razorLeaf)

                gsap.to(razorLeaf.position, {
                    x: recipient.position.x + 25,
                    y: recipient.position.y + 50,
                    onComplete: () => {
                        //ENEMY GETS HIT
                        gsap.to(healthBar, {
                            width: recipient.health + "%"
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