const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

console.log(collisions);

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for(let i = 0; i < collisions.length; i += 160) {
    collisionsMap.push(collisions.slice(i, i + 160))
}

const boundaries = []
collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol !== 0) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width,
                    y: i * Boundary.height
                }
            }))
        }
    })
})
console.log(boundaries)

const image = new Image();
image.src = "Assets/Map/Pokemon World Map.png";

const playerImage = new Image();
playerImage.src = "Assets/Player/FemalePlayer/runDOWN.png"

const background = new Sprite({position: {x: -720, y: -3930}, image: image});

let keys = new LinkedList();

function animate() {
    window.requestAnimationFrame(animate)
    background.draw() //canvas
    ctx.drawImage(                     //Player cropped and centered
        playerImage,
        0,
        0,
        playerImage.width / 6,
        playerImage.height,
        canvas.width / 2 - (playerImage.width / 6) / 2,
        canvas.height / 2 - playerImage.height / 6,
        playerImage.width / 6,
        playerImage.height,
        );

    switch(keys.peek()) {
        case 'w' : background.position.y += 3;
        break;
        case 'a' : background.position.x += 3;
        break;
        case 's' : background.position.y -= 3;
        break;
        case 'd' : background.position.x -= 3;
        break
    }
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
    console.table(keys)
})

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
    console.table(keys)
})