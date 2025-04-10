var board;
var score = 0;
var rows = 4;
var columns = 4;
var timerInterval;
var timeElapsed = 0;

function startTimer() {
    timeElapsed = 0;
    document.getElementById("timer").innerText = timeElapsed + " seconds";
    timerInterval = setInterval(function() {
        timeElapsed++;
        document.getElementById("timer").innerText = timeElapsed + " seconds";
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    timeElapsed = 0;
    document.getElementById("timer").innerText = timeElapsed + " seconds";
}

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    
    
}
//clears the previous tile to set new
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // Clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 2048) {
                alert("Congratulations! You've reached 2048!");
                stopTimer();  // Stop the timer when the player wins
                sendGameDataToServer();  // Save score and time to the server
                return true;
            }
        }
    }
    return false;
}


function checkGameOver() {
    if (hasEmptyTile()) {
        return false; // There is still at least one empty tile
    }
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    }

    // If no moves are possible, display "Game Over" and a restart button
    alert("Game Over! No more moves.");
    showRestartButton();
    return true;
}

function showRestartButton() {
    let restartButton = document.createElement("button");
    restartButton.innerText = "Restart";
    restartButton.id = "restartButton";
    restartButton.onclick = function() {
        resetGame();
    };
    restartButton.classList.add("restart-button"); // Add a class for styling
    document.body.appendChild(restartButton);
}


function resetGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    document.getElementById("score").innerText = score;

    // Remove the restart button
    let restartButton = document.getElementById("restartButton");
    if (restartButton) {
        restartButton.remove();
    }

    // Clear the board and reinitialize the game
    document.getElementById("board").innerHTML = "";
    setGame();
}
//Tile movement
document.addEventListener('keyup', (e) => {
    let boardBeforeMove = copyBoard(board);
    if (e.code == "ArrowLeft") {
        slideLeft();
    } else if (e.code == "ArrowRight") {
        slideRight();
    } else if (e.code == "ArrowUp") {
        slideUp();
    } else if (e.code == "ArrowDown") {
        slideDown();
    }

    if (!isBoardsEqual(boardBeforeMove, board)) {
        setTwo();
        if (checkWin()) {
            return; // Stop further checks if the player has won
        }
        if (!checkGameOver()) {
            document.getElementById("score").innerText = score; // Update the displayed score if the game is not over
        }
    }
});

function copyBoard(board) {
    return board.map(row => row.slice());
}

function isBoardsEqual(board1, board2) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board1[r][c] !== board2[r][c]) {
                return false;
            }
        }
    }
    return true;
}

function filterZero(row) {
    return row.filter(num => num != 0); // Create new array of all nums != 0
}
//merge and validation tile 
function slide(row) {
    let newRow = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] == newRow[i + 1]) {
            newRow[i] *= 2;
            newRow[i + 1] = 0;
            score += newRow[i];
        }
    } //[4, 0, 2]
    newRow = filterZero(newRow); //[4, 2]
    // Add zeroes
    while (newRow.length < columns) {
        newRow.push(0);
    } //[4, 2, 0, 0]
    return newRow;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let newRow = slide(board[r]);
        board[r] = newRow;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let rowReversed = board[r].reverse(); // Reverse the row to slide right
        let newRow = slide(rowReversed);
        board[r] = newRow.reverse(); // Reverse back after sliding
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let newRow = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = newRow[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]].reverse(); // Reverse the column to slide down
        let newRow = slide(row);
        let reversedNewRow = newRow.reverse(); // Reverse back after sliding
        for (let r = 0; r < rows; r++) {
            board[r][c] = reversedNewRow[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}
//Tile Generation
function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function updateBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}
function sendGameDataToServer() {
    const gameData = {
        player_name: "Player1", // You can prompt the player for their name or use a default
        score: score,
        time_taken: timeElapsed
    };

    fetch('http://localhost/2048_game/save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Score and time saved successfully!");
        } else {
            alert("Failed to save score and time.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
