const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");


canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "Assets/Map/Pokemon World Map.png";

const playerImage = new Image();
playerImage.src = "Assets/Player/FemalePlayer/runDOWN.png"

const background = new Sprite({position: {x: -720, y: -4000}, image: image});

Array.prototype.peek = function () {
    if (this.length === 0) {
        throw new Error("out of bounds");
    }
    return this[this.length - 1];
}


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