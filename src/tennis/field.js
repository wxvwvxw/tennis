import Sprite from './sprite';

class Field {

    constructor({width=800, height=600, left=0, top=0, color='#0f0', image}){
        this.width = width;
        this.height = height;
        this.left = left;
        this.top = top;
        this.color = color;
        this.sprite = new Sprite({
            left: left,
            top: left,
            width: width,
            height: height,
            rect: [0, 0, image.width, image.height],
            image,
        });
    }

    render(ctx){
        ctx.save();
        ctx.fillStyle = this.color;
        this.sprite.render(ctx);
        // ctx.fillRect(this.left, this.top, this.width, this.height);
        ctx.restore();
    }
}

export default Field;
