import React, { Component } from 'react';
import Header from './Header';
import './Score.css';

class Score extends Component {
  constructor(){
    super();
    let score = [];
    try{
      score = JSON.parse(localStorage.getItem('score')||'[]').sort((a,b)=> b.score -a.score);
    }
    catch(e){
      score = [];
    }

    this.state ={
      score
    };
  }

  render() {
    const {score} = this.state;
    return (
      <div>
        <Header />
        <div id='tableName'>Highscore table</div>
  
        <div id='tableWrapp'>
            <table border="1">
              <thead>
                <tr>
                    <th>Number</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
              </thead>
              <tbody>
              {score.map((row, index)=>(
                <tr>
                  <th>{index+1}</th>
                  <th>{row.name}</th>
                  <th>{row.score}</th>
                </tr>
              ))}

              </tbody>
            </table>
            <a id='playAgain' href="/">Play Again</a>
        </div>
      </div>
    )
  }
}

export default Score;
