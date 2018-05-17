import React, { Component } from 'react';
import Game from './tennis/game';
import Header from './Header';
import './Canvas.css';

const TIME = 60000;

class Scene extends Component {
    constructor() {
        super();
        const name1 = localStorage.getItem('name1');
        const name2 = localStorage.getItem('name2');
        this.state = {
          name1,
          name2,
          score1: 0,
          score2: 0,
          time: TIME / 1000,
          finish: Date.now() + TIME,
          width: 800,
          height: 500
        };
        setTimeout(()=>this.updateTimer(), 500);
      }

      updateTimer(){
        const time = Math.round((this.state.finish - Date.now())/ 1000);
        if (time < 0){
          return this.gameOver();
        }
        this.setState(Object.assign({}, this.state, {time}))
        setTimeout(()=>this.updateTimer(), 500);
      }

      gameOver(){
        let score = [];
        try{
          score = JSON.parse(localStorage.getItem('score')||'[]');
        }
        catch(e){
          score = []
        }
        const {name1, name2, score1, score2} = this.state;
        score.push({
          name: name1,
          score: score1
        });
        score.push({
          name: name2,
          score: score2
        });
        localStorage.setItem('score', JSON.stringify(score));
        setTimeout(()=>window.location.href =  '/score', 500);
      }

      score({player}){
        const score = {};
        score['score'+player] = this.state['score'+player] + 1;
        this.setState(Object.assign({}, this.state, score));
        this.game.start();
      }
        
      componentDidMount() {
          this.context = this.refs.canvas.getContext('2d');
          var self = this;

          this.game = new Game({
            width: this.state.width,
            height: this.state.height,
            onScore: function(params) {
              self.score(params)
            }
          })
          this.lastUpdate = Date.now();
          this.game.create()
            .then(()=>{
              this.game.start();
              this.update();
              window.addEventListener('keydown', (ev)=>{
                switch(ev.key.toLowerCase()){
                  case 'arrowup': 
                    this.game.player2.startMove(-1);
                    break;
                  case 'arrowdown': 
                    this.game.player2.startMove(1);
                    break;
                  case 'arrowleft': 
                    this.game.player2.jump();
                    break;
                  case 'a': 
                    this.game.player1.startMove(-1);
                    break;
                  case 'z': 
                    this.game.player1.startMove(1);
                    break;
                  case 'x': 
                    this.game.player1.jump();
                    break;                    
                  default:
                    break;
                }
              });
    
              window.addEventListener('keyup', (ev)=>{
                switch(ev.key.toLowerCase()){
                  case 'arrowup': 
                  case 'arrowdown': 
                    this.game.player2.stopMove();
                    break;
                  case 'a': 
                  case 'z': 
                    this.game.player1.stopMove();
                    break;
                  default:
                    break;
                }
              })
            })
      }
    
      update() {
        const now = Date.now();
        this.game.update((now - this.lastUpdate)/1000);
        this.game.render(this.refs.canvas.getContext('2d'));
        this.lastUpdate = now;
        window.requestAnimationFrame(()=>this.update());
      }
    
    render() {
        const {name1, name2, score1, score2, time} = this.state;

        return (
          <div id='wrapper'>
              <Header />
              <span id='scoreNameWrapp'>
                  <span>
                    {name1}
                    <input className='scorePlayers' type='text' name='scoreP1' value={score1} />
                    :
                    <input className='scorePlayers' type='text' name='scoreP2' value={score2} />
                    {name2}
                  </span>
                  <br/>
                  <div id='gameTimer'>осталось {time} секунд</div>
              </span>

                
              <div className='canvas-wrapper'>
                <canvas ref="canvas"
                  width={this.state.width}
                  height={this.state.height}
                />
              </div>

              <div id='touchControl1'>
                  <div onMouseDown={()=>this.game.player1.startMove(-1)}
                    onTouchStart={()=>this.game.player1.startMove(-1)} 
                    onMouseUp={()=>this.game.player1.stopMove()}
                    onTouchEnd={()=>this.game.player1.stopMove()} id='up1' className='controlButtons'>Up</div>
                  <div onClick={()=>this.game.player1.jump()}
                       onTouchStart={()=>this.game.player1.jump()} id='arrow1' className='controlButtons'><span className='arrow'> &gt; </span></div>
                  <div onMouseDown={()=>this.game.player1.startMove(1)}
                       onTouchStart={()=>this.game.player1.startMove(1)} 
                    onMouseUp={()=>this.game.player1.stopMove()}
                    onTouchEnd={()=>this.game.player1.stopMove()} id='down1' className='controlButtons'>Down</div>
              </div>
              <div id='touchControl2'>
                  <div 
                    onMouseDown={()=>this.game.player2.startMove(-1)}
                    onTouchStart={()=>this.game.player2.startMove(-1)} 
                    onMouseUp={()=>this.game.player2.stopMove()}
                    onTouchEnd={()=>this.game.player2.stopMove()} 
                  id='up2' className='controlButtons'>Up</div>
                  <div 
                    onClick={()=>this.game.player2.jump()}
                    onTouchStart={()=>this.game.player2.jump()}
                    id='arrow2' className='controlButtons'>
                    <span className='arrow'> &lt; </span>
                  </div>
                  <div 
                    onMouseDown={()=>this.game.player2.startMove(1)}
                    onTouchStart={()=>this.game.player2.startMove(1)} 
                    onMouseUp={()=>this.game.player2.stopMove()}
                    onTouchEnd={()=>this.game.player2.stopMove()}
                    id='down2' className='controlButtons'>Down</div>
              </div>

          </div>

        );
      }
    }

export default Scene;
