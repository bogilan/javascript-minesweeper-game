const gameBoard = document.querySelector('.board');

let boardWidth = 10;
const squaresNum = boardWidth * boardWidth;
let bombsNum = 20;
let squares = [];

createBoard();

function createBoard() {

    const bombs = Array(bombsNum).fill('bomb');
    const empties = Array(squaresNum - bombsNum).fill('empty');
    const grid = empties.concat(bombs); // combine fields
    const gameGrid = shuffleArray(grid); // shuffle grid
    
    for (let i = 0; i < squaresNum; i++) {
        // create field elements
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(gameGrid[i]);
        square.addEventListener('click', function() {
            revealSquare(square);
        });
        gameBoard.appendChild(square);
        squares.push(square);
    }
    
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}



function revealSquare(square) {
    if (square.classList.contains('bomb')) {
      // handle game over logic (display all bombs)
      squares.forEach(square => {
        if(square.classList.contains('bomb')) {
            square.innerHTML = `&#128163;`;
        }
      })
       
    } else {
      const adjacentMines = getAdjacentMines(square);
      square.classList.add('revealed');
      square.textContent = adjacentMines;
  
      if (adjacentMines === 0) {
        // reveal adjacent squares recursively
        const row = Math.floor(square.id / boardWidth);
        const col = square.id % boardWidth;
        square.textContent = '';
        revealAdjacentSquares(row, col);
      }
    }
  }
  
function getAdjacentMines(square) {
    const row = Math.floor(square.id / boardWidth);
    const col = square.id % boardWidth;
    let count = 0; 
    // check all neighboring squares for bombs
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < boardWidth && j >= 0 && j < boardWidth) {
          const neighbor = squares[i * boardWidth + j];
          if (neighbor.classList.contains('bomb')) {
            count++;
          }
        }
      }
    }
    return count;
  }
  
function revealAdjacentSquares(row, col) {
    // reveal all adjacent squares that are not bombs
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i >= 0 && i < boardWidth && j >= 0 && j < boardWidth) {
          const neighbor = squares[i * boardWidth + j];
          if (!neighbor.classList.contains('bomb') && !neighbor.classList.contains('revealed')) {
            const adjacentMines = getAdjacentMines(neighbor);
            neighbor.classList.add('revealed');
            neighbor.textContent = adjacentMines;
            if (adjacentMines === 0) {
              revealAdjacentSquares(i, j);
              neighbor.textContent = '';
            }
          }
        }
      }
    }
}
  