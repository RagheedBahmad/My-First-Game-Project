const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 578;

const collisionsMap = [];
for(let i = 0; i < collisions.length; i += 160) {
    collisionsMap.push(collisions.slice(i, i + 160))
}
const battleZonesMap = [];
for(let i = 0; i < battleGround.length; i += 160) {
    battleZonesMap.push(battleGround.slice(i, i + 160))
}

const offset = {
    x: -720,
    y: -3960
}

//MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++

flameBoyImage = new Image();
flameBoyImage.src = "Assets/Monsters/Flame Monster.png"
const flameBoy = new Sprite({
    position: {
        x: 600,
        y: 100
    },
    image: flameBoyImage,
    frames: {
        max: 6,
        hold: 10
    },
    animate: true,
    isEnemy: true
})

grassBoyFrontImage = new Image();
grassBoyFrontImage.src = "Assets/Monsters/Grass Monster Front.png"
const grassBoyFront = new Sprite({
    position: {
        x: 600,
        y: 100
    },
    image: grassBoyFrontImage,
    frames: {
        max: 4,
        hold: 10
    },
    animate: true
})

grassBoyBackImage = new Image();
grassBoyBackImage.src = "Assets/Monsters/Grass Monster Back.png"
const grassBoyBack = new Sprite({
    position: {
        x: 250,
        y: 250
    },
    image: grassBoyBackImage,
    frames: {
        max: 4,
        hold: 10
    },
    animate: true,
})

//MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++ MONSTERS ++++++++
const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol !== 0) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
        }
    })
}) // initiating collision array

const battleZones = []
battleZonesMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if(symbol !== 0) {
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }))
        }
    })
})
const image = new Image();
image.src = "Assets/Map/Pokemon World Map.png"; // Pokemon Map

const playerDownImage = new Image();
playerDownImage.src = "Assets/Player/FemalePlayer/runDOWN.png" // Player Image
const playerUpImage = new Image();
playerUpImage.src = "Assets/Player/FemalePlayer/runUP.png" // Player Image
const playerLeftImage = new Image();
playerLeftImage.src = "Assets/Player/FemalePlayer/runLEFT.png" // Player Image
const playerRightImage = new Image();
playerRightImage.src = "Assets/Player/FemalePlayer/runRight.png" // Player Image

const foreGroundImage = new Image();
foreGroundImage.src = "Assets/Map/Pokemon World ForeGround.png"

const player = new Sprite({
    position: {
        x:canvas.width / 2 - (192 / 6) / 2,
        y:canvas.height / 2 - 40 / 6
    },
    image: playerDownImage,
    frames: {
        max: 6,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage
    }
}) // player Sprite
const background = new Sprite({position: {x: offset.x, y: offset.y}, image: image}); // Map Sprite
const foreground = new Sprite({position: {x: offset.x, y: offset.y}, image: foreGroundImage});

const movables = [background, ...boundaries, foreground, ...battleZones]
const battle = {
    initiated: false
}

let keys = new LinkedList();

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width * 0.8 >= rectangle2.position.x &&
        rectangle1.position.x + rectangle1.width * 0.2 <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height * 0.6 <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height * 0.9 >= rectangle2.position.y
    );
}

function animate() {
    const animationID = window.requestAnimationFrame(animate)
    background.draw() //canvas
    // boundaries.forEach((boundary) => { // boundaries
    //     boundary.draw();
    //     if(rectangularCollision({rectangle1: player, rectangle2: boundary})) {
    //         console.log("collision")
    //     }
    // }) //Boundaries TEMPORARY
    battleZones.forEach(battleZone => {
        battleZone.draw();
    }) // Battlezones TEMPORARY
    player.draw(); //PLAYER
    foreground.draw(); //FOREGROUNDS

    let moving = true;
    player.animate = false;
    if(battle.initiated) return

    // ACTIVATE A BATTLE---------------------------------------------------------------------------------------------

    if(keys.peek() === 'w' || keys.peek() === 'a' || keys.peek() === 's' || keys.peek() === 'd') {
        for(let i = 0; i < battleZones.length; i++) {
            const battleZone = battleZones[i];
            const overLappingArea =
                (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
                Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                Math.max(player.position.y, battleZone.position.y));
            if(rectangularCollision({
                rectangle1: player,
                rectangle2 : battleZone
            }) && overLappingArea > (player.width * player.height) / 2
                && Math.random() < 0.05
            ) {
                //deactivate current animation loop
                window.cancelAnimationFrame(animationID)
                battle.initiated = true;
                gsap.to("#battleFlash", {
                    opacity: 1,
                    repeat: 4,
                    yoyo: true,
                    duration: 0.1,

                    onComplete() {
                        gsap.to("#battleFlash", {
                            opacity: 1,
                            duration: 0.1,
                            onComplete() {
                                animateBattle();
                                gsap.to("#battleFlash", {
                                    opacity: 0,
                                    duration: 0.1,
                                })
                            }
                        })
                    }
                })
                player.animate = false;
                break;
            }
        }
    }

    // MOVING AND DIRECTIONAL CODE -------------------------------------------------------------------------------

    switch(keys.peek()) {
        case 'w' :
            player.animate = true;
            player.image = player.sprites.up;
            for(let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2 :{
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y + 5
                        }
                    }
                })) {
                    moving = false;
                    break;
                }
            }

            if(moving)
                movables.forEach((movable) => {
                movable.position.y += 5;
        })
        break;
        case 'a' :
            player.animate = true;
            player.image = player.sprites.left;
            for(let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2 :{
                        ...boundary,
                        position: {
                            x: boundary.position.x + 5,
                            y: boundary.position.y
                        }
                    }
                })) {
                    moving = false;
                    break;
                }
            }

            if(moving)
                movables.forEach((movable) => {
                movable.position.x += 5;
        })
        break;
        case 's' :
            player.animate = true;
            player.image = player.sprites.down;
            for(let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2 :{
                        ...boundary,
                        position: {
                            x: boundary.position.x,
                            y: boundary.position.y - 5
                        }
                    }
                })) {
                    moving = false;
                    break;
                }
            }

            if(moving)
                movables.forEach((movable) => {
                movable.position.y -= 5;
        })
        break;
        case 'd' :
            player.animate = true;
            player.image = player.sprites.right;
            for(let i = 0; i < boundaries.length; i++) {
                const boundary = boundaries[i];
                if(rectangularCollision({
                    rectangle1: player,
                    rectangle2 :{
                        ...boundary,
                        position: {
                            x: boundary.position.x - 5,
                            y: boundary.position.y
                        }
                    }
                })) {
                    moving = false;
                    break;
                }
            }

            if(moving)
                movables.forEach((movable) => {
                movable.position.x -= 5;
        })
        break
    } // Player Movement and Speed
}
 animate(); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const battleBackgroundImage = new Image();
battleBackgroundImage.src = "Assets/Map/battleGround.png";
const battleBackground = new Sprite({
    position: {
        x: 0,
        y: -100
    },
    image: battleBackgroundImage
});

//ANIMATE BATTLE ************************************************************************************** ANIMATE BATTLE
const renderedSprites = [flameBoy, grassBoyBack]
function animateBattle() {
    window.requestAnimationFrame(animateBattle)
    battleBackground.draw();
    flameBoy.draw();
    grassBoyBack.draw();
    renderedSprites.forEach((sprite) => {
        sprite.draw();
    })
}

document.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", (e) => {
        console.log(attacks[e.currentTarget.innerHTML])
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        flameBoy.attack({
            attack: selectedAttack,
            recipient: grassBoyBack,
            renderedSprites
        })
    })
})


window.addEventListener("keydown", (e) => {
    switch(e.key) {
        case 'w' :
            if (keys.indexOf('w') === -1 ) keys.add('w');
            break;
        case 'a' :
            if (keys.indexOf('a') === -1 )keys.add('a');
            break;
        case 's' :
            if (keys.indexOf('s') === -1 )keys.add('s');
            break;
        case 'd' :
            if (keys.indexOf('d') === -1 )keys.add('d')
            break;
    }
}) // Keydown Listener

window.addEventListener("keyup", (e) => {
    switch(e.key) {
        case 'w' :
            keys.removeElement('w');
            break;
        case 'a' :
            keys.removeElement('a');
            break;
        case 's' :
            keys.removeElement('s');
            break;
        case 'd' :
            keys.removeElement('d');
            break;
    }
}) // Keyup Listener