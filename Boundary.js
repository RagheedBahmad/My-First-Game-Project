class Boundary{
    static width = 43.2;
    static height = 43.2;
    constructor({position}) {
        this.position = position;
        this.width = 43.2;
        this.height = 43.2;
    }

    draw() {
        ctx.fillStyle = "rgba(255,0,0,0.2)";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}