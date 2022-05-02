'use strict';

const e = React.createElement;

class Square extends React.Component {
  constructor(props) {
    super(props);
	const {value, handleClick} = this.props;
  }

  render() {

    return e(
      'div',
      { 
	  class: 'square',
	  onClick: () => {
		  if (this.props.value != ''){
			  return;
		  }
		  this.props.onClick();
		  this.setState({ isFilled: true });
		}
	  },
	  this.props.value
    );
  }
}
		

class Board extends React.Component {
	constructor(props) {
		super(props);
	}
	
	initializeSquare(i){
	return e( Square, 
			{
				value: this.props.logicBoard[i],
				onClick: () => { this.props.onClick(i);}
			}
		)
	}
  
	render() {
		const gameBoard = new Array(9)
		for (let i = 0; i < 9; i++){
			gameBoard.push(this.initializeSquare(i));
		}							
		
		return e(
			'div',
			{
			class: 'square-container'
			},
			gameBoard
		);
	}
}
class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = { gameWinner: '', filledSquares: 0, nextMove: 'X', logicBoard: (new Array(9).fill('')), history: new Array()};
	}
	
	checkWinner(){
		var winner = '';
		if (this.state.filledSquares == 8 ){
			this.setState({gameWinner: 'Tie!'});
			return;
		}
		
		for (let i = 0; i < 9; i += 3) {
			winner = this.state.logicBoard[i];
			for (let j = 0; j < 3; j++){
				if (winner != '' && winner != this.state.logicBoard[i+j]){
					winner = '';
				}
			}
			if (winner != ''){
				this.setState({gameWinner: winner})
				return;
			}
		}
		
		for (let i = 0; i < 3; i++) {
			winner = this.state.logicBoard[i];
			for (let j = 0; j < 9; j += 3){
				if (winner != '' && winner != this.state.logicBoard[i+j]){
					winner = '';
				}
			}
			if (winner != ''){
				this.setState({gameWinner: winner})
				return;
			}
		}
		
		winner = this.state.logicBoard[0];
		for (let i = 0; i < 9; i += 4) {
			if (winner != '' && winner != this.state.logicBoard[i]){
				winner = '';
			}
		}
		if (winner != ''){
			this.setState({gameWinner: winner})
			return;
		}
		
		winner = this.state.logicBoard[2];
		for (let i = 2; i < 7; i += 2) {
			if (winner != '' && winner != this.state.logicBoard[i]){
				winner = '';
			}
		}
		if (winner != ''){
			this.setState({gameWinner: winner})
			return;
		}
		

		
	}
	
	handleClick(i){
		this.state.history.push(this.state.logicBoard.slice());
		this.state.logicBoard[i] = this.state.nextMove;
		this.checkWinner();
		this.setState({ filledSquares: this.state.filledSquares+1,
						nextMove: (((this.state.filledSquares+1) % 2)==0 ? 'X' : 'O')
						});
		
	}
	
	goToMove(turn){
		this.setState({gameWinner: '', 
					   filledSquares: turn, 
					   nextMove: ((turn%2)==0 ? 'X' : 'O'), 
					   logicBoard: this.state.history[turn], 
					   history: this.state.history.slice(0, turn)})
	}
	
	render() {

		const nextMoveMessage = ( this.state.gameWinner != '') ? 
								('Winner: ' + this.state.gameWinner) : 
								('Next move: ' + this.state.nextMove);
								
		const moveHistory = this.state.history.map((move, turn) => {
														return (
															e('button',
															{onClick: () => this.goToMove(turn)},
															('Go to ' + ((turn == 0) ? 'start' : ('turn ' + turn)))
															)
														);
													}
		);
		
		return e(
			'div',
			{},
			nextMoveMessage,
			e(Board,
			{
				logicBoard: this.state.logicBoard,
				onClick: (i) => {
								if (this.state.gameWinner == ''){
									this.handleClick(i);
								}
								}
			}
			),
			e('ol', {}, moveHistory)
		);
	}
}	
	

const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Game));