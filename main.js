const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for(let i = 0; i < collisions.length; i += 160) {
    collisionsMap.push(collisions.slice(i, i + 160))
}

const offset = {
    x: -720,
    y: -3930
}


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

const image = new Image();
image.src = "Assets/Map/Pokemon World Map.png"; // Pokemon Map

const playerImage = new Image();
playerImage.src = "Assets/Player/FemalePlayer/runDOWN.png" // Player Image

const player = new Sprite({
    position: {
        x:canvas.width / 2 - (192 / 6) / 2,
        y:canvas.height / 2 - 40 / 6
    },
    image: playerImage,
    frames: {
        max: 6
    }
}) // player Sprite

const background = new Sprite({position: {x: offset.x, y: offset.y}, image: image}); // Map Sprite
const movables = [background, ...boundaries]

let keys = new LinkedList();

function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y + rectangle1.height / 2 <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}


function animate() {
    window.requestAnimationFrame(animate)
    background.draw() //canvas
    boundaries.forEach((boundary) => { // boundaries
        boundary.draw();
        if(rectangularCollision({rectangle1: player, rectangle2: boundary})) {
            console.log("collision")
        }
    })
    player.draw();

    switch(keys.peek()) {
        case 'w' : movables.forEach((movable) => {
            movable.position.y += 3;
        })
        break;
        case 'a' : movables.forEach((movable) => {
            movable.position.x += 3;
        })
        break;
        case 's' : movables.forEach((movable) => {
            movable.position.y -= 3;
        })
        break;
        case 'd' : movables.forEach((movable) => {
            movable.position.x -= 3;
        })
        break
    } // Player Movement and Speed
}
animate();

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