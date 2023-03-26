const gameBoard = document.querySelector('.board');

let boardWidth = 10;
const squaresNum = boardWidth * boardWidth;
let bombsNum = 10;
let squares = [];
let bombsFlagged = 0;
let squaresRevealed = 0;
createBoard();

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
          toggleFlag(square); // toggle flag on the square
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
    // If the square contains a bomb, reveal all bombs
    if (square.classList.contains('bomb')) {
      squares.forEach(square => {
        if(square.classList.contains('bomb')) {
          square.textContent = `💣`;
        } 
      }) 
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
  // check for the win
  checkWin();
}

// CHECK FOR WIN
function checkWin() {
  // win condition:
  // if all revealed squares and flagged bombs combined are equal to toal squares number
  // and flagged bombs number is equal to total bombs number
  if (squaresRevealed + bombsFlagged === squaresNum && bombsFlagged === bombsNum) {
    alert('You Won!');
  }
}