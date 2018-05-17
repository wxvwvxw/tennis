import Sprite from './sprite';

class Bonus {

    constructor({id, position={x:100, y: 0}, title='', timeout=30, size=20, handler, image}){
        this.id = id;
        this.position = position;
        this.title = title;
        this.timeout = timeout;
        this.size = size;
        this.startTime = Date.now();
        this.handler = handler;
        this.image = this.image;

        this.sprite = new Sprite({
            left: position.x - size,
            top:  position.y - size,
            width: size * 2,
            height: size * 2,
            rect: [0, 0, image.width, image.height],
            image,
        });
    }

    render(ctx){
        ctx.save();
        this.sprite.render(ctx);
        ctx.beginPath();
        ctx.arc(
            this.position.x, 
            this.position.y,
            this.size,
            0, 
            2 * Math.PI
        );
        ctx.stroke();
        ctx.restore();
    }
}

export default Bonus;
