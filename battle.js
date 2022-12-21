let flameBoy
let grassBoy
let renderedSprites
let queue

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



let battleAnimationId

function initBattle() {
    document.querySelector("#UI").style.display = "block"
    document.querySelector("#dialogueBox").style.display = "none"
    document.querySelector("#enemyHealthBar").style.width = "100%"
    document.querySelector("#playerHealthBar").style.width = "100%"
    document.querySelector("#attacksBox").replaceChildren()

    flameBoy = new Monster(monsters.flameBoy)
    grassBoy = new Monster(monsters.grassBoy)
    renderedSprites = [flameBoy, grassBoy]
    queue = []


    grassBoy.attacks.forEach((attack) => {
        const button = document.createElement("button")
        button.innerHTML = attack.name
        document.querySelector("#attacksBox").append(button)
    })

    document.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            grassBoy.attack({
                attack: selectedAttack,
                recipient: flameBoy,
                renderedSprites
            })

            if(flameBoy.health <= 0) {
                queue.push(() => {
                    flameBoy.faint()
                })
                queue.push(() => {
                    gsap.to("#battleFlash", {
                        opacity: 1,
                        onComplete: () => {
                            cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector("#UI").style.display = "none"
                            gsap.to("#battleFlash", {
                                opacity: 0
                            })
                            audio.Map.play()
                            battle.initiated = false
                        }
                    })
                })
                return;
            }
            //monster attacks right hereeeeeeeeeeeeeeeeeeeeeee
            const randomAttack = flameBoy.attacks[Math.floor(Math.random() * flameBoy.attacks.length)]

            queue.push(() => {
                flameBoy.attack({
                    attack: randomAttack,
                    recipient: grassBoy,
                    renderedSprites
                })

                if(grassBoy.health <= 0) {
                    queue.push(() => {
                        grassBoy.faint()
                    })

                    queue.push(() => {
                        gsap.to("#battleFlash", {
                            opacity: 1,
                            onComplete: () => {
                                cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector("#UI").style.display = "none"
                                gsap.to("#battleFlash", {
                                    opacity: 0
                                })
                                battle.initiated = false
                                audio.Map.play()
                            }
                        })
                    })
                }
            })
        })

        button.addEventListener("mouseenter", (e) => {
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector("#attackType").innerHTML = selectedAttack.type
            document.querySelector("#attackType").style.color = selectedAttack.color
        })
    })
}
function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw();
    flameBoy.draw();
    grassBoy.draw();
    renderedSprites.forEach((sprite) => {
        sprite.draw();
    })
}


document.querySelector("#dialogueBox").addEventListener("click", (e) => {
    if(queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = "none"
})