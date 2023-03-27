const gameBoard = document.querySelector('.board');
const timer = document.querySelector('.time-counter');
const flagCounter = document.querySelector('.flag-counter');
const gameState = document.querySelector('.game-state');

let boardWidth = 10;
const squaresNum = boardWidth * boardWidth;
let bombsNum = 10;
let squares = [];
let bombsFlagged = 0;
let squaresRevealed = 0;
let time = 0;
let startTimer;
let gameOver = false;

// Create new board on screen load
createBoard();

// START NEW GAME
// restart all variables and create new board
gameState.addEventListener('click', ()=> {
  gameState.textContent = '😄';
  squares = [];
  bombsFlagged = 0;
  squaresRevealed = 0;
  time = 0;
  gameOver = false;
  gameBoard.innerHTML = '';
  createBoard();
  clearInterval(startTimer);
  startTimer = false;
  flagCounter.textContent = '000';
  timer.textContent = '000';
});

// CREATE GAME BOARD
function createBoard() {
    // Create an array of 'bombs' and 'empty' fields
    const bombs = Array(bombsNum).fill('bomb');
    const empties = Array(squaresNum - bombsNum).fill('empty');
    const grid = empties.concat(bombs); // combine them together
    const gameGrid = shuffleArray(grid); // and shuffle the grid to randomize bombs placement
    
    for (let i = 0; i < squaresNum; i++) {
        // create field elements
        const square = document.createElement('div');
        square.setAttribute('id', i); // Set the ID of the square to its index in the grid array
        square.classList.add(gameGrid[i]); // Add the 'bomb' or 'empty' class to the square based on its value in the game grid
        gameBoard.appendChild(square); // Add the square element to the game board
        squares.push(square); // Add the square element to the 'squares' array for later reference
        square.addEventListener('click', function() { // on left click
          if(!square.classList.contains('flag')) { // If the square is not already flagged
            revealSquare(square); // reveal the square
            checkWin(); // and check for a win
          }
        });
        square.addEventListener('contextmenu', (e)=> { // on right click
          e.preventDefault();
          if (gameOver) {
            return; // do nothing if the game is over
          }
          toggleFlag(square); // toggle flag on the square
        });
        square.addEventListener('mousedown', function() { // change game icon on holding mouse key
          if (gameOver) {
            return; // do nothing if the game is over
          }
          gameState.textContent = '😅';
        });
        square.addEventListener('mouseup', function() { // change game icon on after mouse key press
          if (gameOver) {
            return; // do nothing if the game is over
          }
          gameState.textContent = '😄';
        });
    }
    
}

// function to shuffle the array elements and randomize their placement
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// REVEAL CLICKED SQUARE
function revealSquare(square) {
    // Exit function if game is already over
    if (gameOver) {
      return; // do nothing if the game is over
    }
    // If the square contains a bomb, reveal all bombs
    if (square.classList.contains('bomb')) {
      squares.forEach(square => {
        if(square.classList.contains('bomb')) {
          square.textContent = `💣`;
        } 
      })
      gameState.innerHTML =  `You lost!<br>😫`;
      clearInterval(startTimer);
      gameOver = true;
    } else { // If the square does not contain a bomb, reveal adjacent squares and display the number of adjacent bombs
      // get the number of adjacent mines
      const adjacentMines = getAdjacentMines(square);
      square.classList.add('revealed'); // reveal the square
      square.textContent = adjacentMines; // display the number of adjacent bobms
      squaresRevealed++; // increment the number of squares revealed
      // If the square has no adjacent bombs, reveal all adjacent squares
      if (adjacentMines === 0) {
        // get the row and column of the square
        const row = Math.floor(square.id / boardWidth);
        const col = square.id % boardWidth;
        square.textContent = ''; // set text content to empty value
        revealAdjacentSquares(row, col); // reveal all adjacent squares
      }
    }
  }

// GET NUMBER OF MINES
function getAdjacentMines(square) {
    // Find the row and column of the square
    const row = Math.floor(square.id / boardWidth);
    const col = square.id % boardWidth;
    let adjBombsNum = 0; // set initial number to 0
    // Loop through all squares adjacent to the given square
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        // Make sure to check only squares within the board
        if (i >= 0 && i < boardWidth && j >= 0 && j < boardWidth) {
          const neighbourSquare = squares[i * boardWidth + j]; // get the neighbouring element
          if (neighbourSquare.classList.contains('bomb')) { // if it is a bomb
            adjBombsNum++; // increment the count
          }
        }
      }
    }
    return adjBombsNum; // return the number of bombs nearby
}

// REVEAL ADJACENT EMPTY SQUARES
function revealAdjacentSquares(row, col) {
    // Iterate over all adjacent squares
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        // Make sure to check only squares within the board
        if (i >= 0 && i < boardWidth && j >= 0 && j < boardWidth) {
          // get the adjacent square
          const neighbourSquare = squares[i * boardWidth + j];
          // and reveal it only if it is not a bomb, if it is not already revealed, and if it is not flagged
          if (!neighbourSquare.classList.contains('bomb') && !neighbourSquare.classList.contains('revealed') && !neighbourSquare.classList.contains('flag')) {
            const adjacentMines = getAdjacentMines(neighbourSquare);
            neighbourSquare.classList.add('revealed');
            neighbourSquare.textContent = adjacentMines;
            squaresRevealed++; // update the squares revealed number
            // If the square has no adjacent mines, recursively reveal its adjacent squares
            if (adjacentMines === 0) {
              revealAdjacentSquares(i, j);
              neighbourSquare.textContent = '';
            }
          }
        }
      }
    }
}

// TOGGLE FLAG
function toggleFlag(square) {
  if (gameOver) {
    return; // do nothing if the game is over
  }
  // check if the square has already been revealed
  if (!square.classList.contains('revealed')) {
    // add flag if the square doesn't have one
    if (!square.classList.contains('flag')) {
      square.classList.add('flag'); 
      square.textContent = '🚩';
      bombsFlagged++;
    } else { // remove flag if the square already has one
      square.classList.remove('flag');
      square.textContent = '';
      bombsFlagged--;
    }
  }
  // display flag number
  if(bombsFlagged < 10) {
    flagCounter.textContent = `00${bombsFlagged}`;  
  }
  else if(bombsFlagged < 99) {
    flagCounter.textContent = `0${bombsFlagged}`;  
  }
  else {
    flagCounter.textContent = bombsFlagged;
  }   
  // check for the win
  checkWin();
}

// CHECK FOR WIN
function checkWin() {
  // win condition:
  // if all revealed squares and flagged bombs combined are equal to toal squares number
  // and flagged bombs number is equal to total bombs number
  if (squaresRevealed + bombsFlagged === squaresNum && bombsFlagged === bombsNum) {
    gameState.innerHTML = `You won!<br>😎`;
    clearInterval(startTimer);
    gameOver = true;
    console.log(squaresRevealed);
    console.log(bombsFlagged);
  }
}


// START TIMER ON LEFT OR RIGHT CLICK
// if timer is not already started and game is not over
gameBoard.addEventListener('click', ()=> {
  if (gameOver) {
    return; // do nothing if the game is over
  }
  if (startTimer) {
    return; // do nothing if the timer is already running
  }
  startTimer = setInterval(updateTimer, 1000);
});

gameBoard.addEventListener('contextmenu', ()=> {
  if (gameOver) {
    return; // do nothing if the game is over
  }
  if (startTimer) {
    return; // do nothing if the timer is already running
  }
  startTimer = setInterval(updateTimer, 1000);
});


// TIMER FUNCTION
function updateTimer() {
    time++;
    if(time < 10) {
      timer.textContent = `00${time}`;  
    }
    else if(time < 99) {
      timer.textContent = `0${time}`;  
    }
    else {
      timer.textContent = time;
    }    
}
