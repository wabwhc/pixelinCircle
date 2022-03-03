export default class dot{
    constructor(x, y, radius, red, green, blue,){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.red = red;
        this.blue = blue;
        this.green = green;
        this.opacity = 1;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fill();
        this.opacity = 0;
    }
}