import Field from './field';
import Ball from './ball';
import Player from './player';
import Bonus from './bonus';
const sprite_field = require('./assets/field.png');
const sprite_ball = require('./assets/ball.png');
const sprite_rocket1 = require('./assets/rocket1.png');
const sprite_rocket2 = require('./assets/rocket2.png');
const collisionSound = require('./assets/collision.mp3');

const bonus_size_decrease = require('./assets/bonus_size_decrease.png');
const bonus_size_encrease = require('./assets/bonus_size_encrease.png');
const bonus_slow_down = require('./assets/bonus_slow_down.png');
const bonus_spped_up = require('./assets/bonus_spped_up.png');

const PLAYER_SIZE = 10;
const PLAYER_WIDTH = 100;
const BONUS_TIMEOUT = 5000;
const BONUS_SIZE = 50;
const DEFAULT_SPEED = 300;
const PLAYER_ACCELERATION = 25;

const loadTexture = (src) => {
    return new Promise((resolve, reject)=>{
        let image = new Image();
        image.onload = () => resolve(image);
        image.src = src;
    })
}

const loadAudio = (src) => {
    return new Promise((resolve, reject)=>{
        let audio = new Audio();
        audio.src = src;
        audio.load();
        return resolve(audio);
    })
}

const bonuses = [
    {
        title: 'Увеличить',
        handler: ({player, ball})=>{
            player.width *= 1.25;
            setTimeout(()=> player.width /= 1.25, BONUS_TIMEOUT)
        },
    },
    {
        title: 'Уменьшить',
        handler: ({player, ball})=>{
            player.width *= 0.75;
            setTimeout(()=> player.width /= 0.75, BONUS_TIMEOUT)
        },
    },
    {
        title: 'Ускорить',
        handler: ({player, ball})=>{
            ball.speed *= 1.25;
        },
    },
    {
        title: 'Замедлить',
        handler: ({player, ball})=>{
            ball.speed *= 0.25;
        },
    },
];

class Game {
    constructor({width, height, onScore=()=>{}}){
        this.width = width;
        this.height = height;
        this.onScore = onScore;
    }

    create(){
        return Promise.all([
            loadTexture(sprite_field),
            loadTexture(sprite_ball),
            loadTexture(sprite_rocket1),
            loadTexture(sprite_rocket2),
            loadTexture(bonus_size_encrease),
            loadTexture(bonus_size_decrease),
            loadTexture(bonus_spped_up),
            loadTexture(bonus_slow_down),
            loadAudio(collisionSound)
        ])
        .then(([
            imageField, 
            imageBall, 
            imageRocket1, 
            imageRocket2, 
            imageBonusSizeEncrease,   
            imageBonusSizeDecrease,   
            imageBonusSppedUp,
            imageBonusSlowDown,   
            collisionSound
        ])=>{
            this.field = new Field({
                width: this.width, 
                height: this.height,
                left: 0,
                top: 0,
                color: '#55ff77',
                image: imageField,
            });

            this.player1 = new Player({
                position: {x: 0, y: 0}, 
                width: PLAYER_WIDTH,
                size: PLAYER_SIZE, 
                color: 'blue',
                image: imageRocket2,
                sign: -1
            });
    
            this.player2 = new Player({
                position: {x: this.width - PLAYER_SIZE, y: this.height - PLAYER_WIDTH}, 
                width: PLAYER_WIDTH,
                size: PLAYER_SIZE, 
                color: 'red',
                image: imageRocket1,
                sign: 1
            });
    
            this.ball = new Ball({
                position: {x: this.width / 2, y: this.height / 2 },
                image: imageBall,
            });

            bonuses[0].image = imageBonusSizeEncrease;
            bonuses[1].image = imageBonusSizeDecrease;
            bonuses[2].image = imageBonusSppedUp;
            bonuses[3].image = imageBonusSlowDown;

            this.bonusesDefinition = bonus_size_encrease;
            this.bonus = [];

            this.collisionSound = collisionSound;
        })
    }

    start(){
        this.ball.setDirection({
            x: (0.5- Math.random()) *3,
            y: (0.5- Math.random()) *3
        });
        this.ball.speed = DEFAULT_SPEED;
        setTimeout(()=>this.addBonus(), BONUS_TIMEOUT);
    }

    update(time){
        if (!time)
            return;
        this.ball.position.x = this.ball.position.x + (this.ball.direction.x * this.ball.speed * time);
        this.ball.position.y = this.ball.position.y + (this.ball.direction.y * this.ball.speed * time);
        this.player1.updatePosition({time, field: this.field});
        this.player2.updatePosition({time, field: this.field});


        //столкновение с ракеткой
        if ( this.ball.position.x > this.player2.position.x && 
            this.ball.position.y >= this.player2.position.y &&
            this.ball.position.y <= this.player2.position.y + this.player2.width
        ){
            this.lastPlayer = this.player2;
            let yPlayerFactor = Math.sign(this.player2.speed)* this.player2.direction.y;
            this.ball.setDirection({
                x: - this.ball.direction.x, 
                y: yPlayerFactor * 0.5 + this.ball.direction.y *.25
            });
            this.ball.speed += PLAYER_ACCELERATION;
            this.ball.position.x =   this.ball.position.x - (this.ball.position.x - this.player2.position.x) ;
            this.collisionSound.play();
        }

        if ( this.ball.position.x < this.player1.position.x + this.player1.size && 
            this.ball.position.y >= this.player1.position.y &&
            this.ball.position.y <= this.player1.position.y + this.player1.width
        ){
            this.lastPlayer = this.player1;
            let yPlayerFactor = Math.sign(this.player1.speed)* this.player1.direction.y;
            this.ball.setDirection({
                x: - this.ball.direction.x, 
                y: yPlayerFactor * 0.5 + this.ball.direction.y *.25
            });
            this.ball.speed += PLAYER_ACCELERATION;
            this.ball.position.x = 2 * this.player1.size + this.ball.position.x;
            this.collisionSound.play();
        }

        //столкновение с верхней и нижней границей 
        if ( this.ball.position.y > this.field.height ){
            this.ball.direction.y = - this.ball.direction.y;
            this.ball.position.y = 2 * this.field.height - this.ball.position.y;
            this.collisionSound.play();
        }
        if ( this.ball.position.y < 0 ){
            this.ball.direction.y = - this.ball.direction.y;
            this.ball.position.y = - this.ball.position.y;
            this.collisionSound.play();
        }

        //вылет в аут
        if ( this.ball.position.x > this.field.width ){
            return this.score({
                player: 1,
            })
        }
        if ( this.ball.position.x < 0 ){
            return this.score({
                player: 2,
            })
        }
                

        this.bonus.forEach(bonus => {
            const distance = Math.pow(this.ball.position.x - bonus.position.x, 2) + 
                Math.pow(this.ball.position.y - bonus.position.y, 2);
            if ( distance <= Math.pow(bonus.size, 2) ) {
                this.applyBonus(bonus);
            } 
        })
    }

    addBonus(){
        const randomBonus = bonuses[Math.floor(Math.random()*bonuses.length)]
        const bonus = new Bonus({
            id: Date.now(),
            position: {
                x: Math.random()*(this.width-this.width*0.25)+this.width*0.125,
                y: Math.random()*(this.height-BONUS_SIZE*2)+BONUS_SIZE,
            },
            title: randomBonus.title,
            handler: randomBonus.handler,
            size: BONUS_SIZE,
            image: randomBonus.image
        });
        this.bonus.push(bonus);
        setTimeout(()=>this.deleteBonus(bonus.id), BONUS_TIMEOUT);
        setTimeout(()=>this.addBonus(), BONUS_TIMEOUT);
    }

    applyBonus(bonus){
        if (!this.lastPlayer)
            return;
        bonus.handler({
            player: this.lastPlayer,
            ball: this.ball
        });
        this.deleteBonus(bonus.id);
    }

    deleteBonus(id){
        this.bonus = this.bonus.filter((b)=> b.id !== id);
    }

    score({player}){
        this.ball.speed = 0;
        this.ball.position = {x: this.width / 2, y: this.height / 2 };
        this.onScore({player});
    }

    render(ctx){
        this.field.render(ctx);
        this.player1.render(ctx);
        this.player2.render(ctx);
        this.ball.render(ctx);
        this.bonus.map(bonus => bonus.render(ctx));
    }
}

export default Game;
