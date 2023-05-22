// <---- Player fabric function ---->

const Player = (name, marker) => {
	let playerArray = []
	const getName = () => name
	const getMarker = () => marker

	// <-- pick and store the cell selected by player -->

	const grabCell = e => {
		const cell = e.target.dataset.id
		// return if selected cell is occupied
		if (e.target.textContent != '') {
			alert('Pick one of free cells!')
			return
		}
		// player mark cell / store cell in array / decrease moves amount
		e.target.textContent = marker
		playerArray.push(cell)
		GameController.moves--
	}

	// <-- check if player win of draw after each move -->

	const checkForWin = () => {
		let isWinner = false
		// winning combinations array
		const winningLines = [
			[1, 4, 7],
			[2, 5, 8],
			[3, 6, 9],
			[1, 2, 3],
			[4, 5, 6],
			[7, 8, 9],
			[1, 5, 9],
			[7, 5, 3],
		]
		// check if stored cells fit winning combinations
		if (winningLines.some(line => line.every(num => playerArray.includes(num.toString())))) {
			// lock the game board / display 'winner'
			GameController.grid.removeEventListener('click', GameController.handleGameBoard)
			GameController.gameInfo.innerHTML = `${name} has won. Congratulations!`
			isWinner = true
		}
		// check if no winner and out of empty cells on game board
		if (GameController.moves === 0 && isWinner == false) {
			// lock the game board / display 'draw'
			GameController.grid.removeEventListener('click', GameController.handleGameBoard)
			GameController.gameInfo.innerHTML = `It's a draw!`
		}
	}
	return { getName, getMarker, grabCell, checkForWin }
}

// <---- Module Pattern -->
// Update game board and control game flow

const GameController = (() => {
	const startBtn = document.querySelector('.start')
	const restartBtn = document.querySelector('.restart')
	const grid = document.querySelector('.grid')
	const inputs = document.querySelectorAll('input')
	const inputBox = document.querySelector('.input-box')
	const gameInfo = document.querySelector('.game-info')
	const playerXMarker = document.querySelector('.player-x')
	const playerOMarker = document.querySelector('.player-o')

	let playerX
	let playerO
	let currentPlayer
	let moves = 9

	// <-- initialize the game -->

	startBtn.addEventListener('click', () => {
		createPlayers()
		setGameBoard()
	})

	// <-- create players basis on factory function -->

	function createPlayers() {
		playerX = Player(inputs[0].value.toUpperCase() || 'Player X', 'X')
		playerO = Player(inputs[1].value.toUpperCase() || 'Player O', 'O')
		currentPlayer = playerX
	}

	// <-- setup the game board -->

	function setGameBoard() {
		gameInfo.textContent = ''
		grid.style.visibility = 'visible'
		startBtn.style.display = 'none'
		inputBox.style.display = 'none'
		playerXMarker.classList.add('active')
		playerXMarker.textContent = playerX.getName()
		playerOMarker.textContent = playerO.getName()
	}

	// <-- toggle players / execute the factory functions for each player -->

	function handleGameBoard(e) {
		if (currentPlayer == playerX) {
			playerX.grabCell(e)
			playerX.checkForWin()
			currentPlayer = playerO
		} else if (currentPlayer == playerO) {
			playerO.grabCell(e)
			playerO.checkForWin()
			currentPlayer = playerX
		}
		playerXMarker.classList.toggle('active')
		playerOMarker.classList.toggle('active')
	}
	// <--
	grid.addEventListener('click', handleGameBoard)
	restartBtn.addEventListener('click', () => location.reload())

	return { gameInfo, moves, grid, handleGameBoard }
})()
