import Sprite from './sprite';

const JUMP_HEIGHT = 150;
const JUMP_DURATION = 1000;
const JUMP_A = - JUMP_HEIGHT / Math.pow(JUMP_DURATION /2 , 2);

class Player {
    constructor({position={x:0, y: 0}, color, width=100, size=10, image, sign}){
        this.sign = sign;
        this.position = position;
        this.width = width;
        this.direction = {x:0, y: 0};
        this.defaultPosition = Object.assign({}, position)
        this.speed = 0;
        this.color = color;
        this.size = size;
        this.isJump = false;

        const ratio = 200 * this.width / 150;
        this.sprite = new Sprite({
            left: position.x,
            top:  position.y,
            width: ratio * 84 / 200,
            height: ratio,
            rect: [0, 0, image.width, image.height],
            image,
        });
    }

    updatePosition({time, field}){
        this.position.y = this.position.y + (this.direction.y * this.speed * time);
        if (this.position.y < 0)
            this.position.y = 0;
        if (this.position.y + this.width > field.height)
            this.position.y = field.height - this.width;
        this.updateJump({time});
    }

    updateJump(){
        if (!this.isJump)
            return;
        const currentTime = Date.now();
        const x = (currentTime - this.startJump)*2;
        if (x > 1000){
            this.position.x = this.sign * this.defaultPosition.x;
            this.isJump = false;
        }
        else{
            this.position.x = this.defaultPosition.x - this.sign *(JUMP_A * Math.pow(x - JUMP_DURATION/2, 2) + JUMP_HEIGHT); 
        }
    }

    startMove(direction){
        this.direction.y = direction;
        this.speed = 500;
    }

    stopMove(){
        this.speed = 0;
    }

    jump(){
        if (this.isJump)
            return;
        this.isJump = true;
        this.startJump = Date.now();
    }

    render(ctx){
        ctx.save();
        ctx.fillStyle = this.color;
        if (this.width < 200){
            const ratio = 200 * this.width / 150;
            this.sprite.width = ratio * 84 / 200;
            this.sprite.height = ratio;
            this.sprite.left = this.position.x - Math.abs(((this.sprite.width - this.width) / 2)) + this.sign * 10;
            this.sprite.top = this.position.y;
            // ctx.fillRect(this.position.x, this.position.y, this.size, this.width);
            this.sprite.render(ctx);
        }
        else
            ctx.fillRect(this.position.x, this.position.y, this.size, this.width);
        ctx.restore();
    }
}

export default Player;
