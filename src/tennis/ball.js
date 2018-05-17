class Ball {

    constructor({position={x:100, y: 0}}){
        this.position = position;
        this.direction = {x:100, y: 0};
        this.speed = 0;
    }

    setDirection({x,y}){
        //нормируем вектор чтобы направление не оказывало влияние на скорость
        const module = Math.sqrt(x*x + y*y);
        this.direction.x = x / module;
        this.direction.y = y / module;
    }
    
    render(ctx){
        ctx.save();
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(
            this.position.x, 
            this.position.y,
            10,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

export default Ball;
