import React, { Component } from 'react';
import Header from './Header';

class Home extends Component {

  constructor(){
    super();
    this.state = {
      name1: 'Player1',
      name2: 'Player2'
    }
  }

  controlButtonFunction(e) {
    e=e||window.event;
    this.style.opacity='0.5';
    this.style.backgroundColor='#F45321';
  }

  controlButtonFunction2(e) {
    e=e||window.event;
    this.style.opacity='0.8';
    this.style.backgroundColor='';
  }

  start(){
    localStorage.setItem('name1', this.state.name1);
    localStorage.setItem('name2', this.state.name2);
    setTimeout(()=>window.location.href =  '/game', 500);
  }

  handleName1Change(event){
    this.setState({name1: event.target.value});
  }

  handleName2Change(event){
    this.setState({name2: event.target.value});
  }

  render() {
    return (
      <div id='wrapper'>
        <Header />

        
          <div id='playersName'>
            <span id='playerColor1'>Player 1 name:</span> 
            <input className='namePlayers' type='text' name='player1Name'
              value={this.state.name1} onChange={(event)=>this.handleName1Change(event)}/>
            <span id='spaceName'>VS</span> 
            <span id='playerColor2'>Player 2 name:</span> 
            <input className='namePlayers' type='text' name='player1Name'
              value={this.state.name2} onChange={(event)=>this.handleName2Change(event)}/>
          </div>
              <div id='start' className='startButton' onTouchStart={this.start.bind(this)} onClick={this.start.bind(this)}>START</div>
      </div>
    );
  }
}

export default Home;
