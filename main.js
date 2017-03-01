function init() {
    var chess_board = document.getElementById("chess_board");

    var rank = document.createElement("TR");

    var square = document.createElement("TD");
    square.className = "square border";
    rank.appendChild(square);

    for (var i = 0; i < 8; i++) {
        var square = document.createElement("TD");
        square.className = "square border";
        square.innerHTML = files[i];
        rank.appendChild(square);
    }

    var square = document.createElement("TD");
    square.className = "square border";
    rank.appendChild(square);

    chess_board.appendChild(rank);

    for (var i = 0; i < 8; i++) {
        var rank = document.createElement("TR");

        var square = document.createElement("TD");
        square.className = "square border";
        square.innerHTML = 8 - i;
        rank.appendChild(square);

        rank.class = "rank";
        for (var j = 0; j < 8; j++) {
            square = document.createElement("TD");
            square.id = (i * 8 + j).toString();
            var color = (j + (i % 2)) % 2 ? "black" : "white";
            square.className = "square " + color;
            rank.appendChild(square);
        }

        var square = document.createElement("TD");
        square.className = "square border";
        square.innerHTML = 8 - i;
        rank.appendChild(square);

        chess_board.appendChild(rank);
    }

    var rank = document.createElement("TR");

    var square = document.createElement("TD");
    square.className = "square border";
    rank.appendChild(square);

    for (var i = 0; i < 8; i++) {
        var square = document.createElement("TD");
        square.className = "square border";
        square.innerHTML = files[i];
        rank.appendChild(square);
    }

    var square = document.createElement("TD");
    square.className = "square border";
    rank.appendChild(square);

    chess_board.appendChild(rank);


    updateBoard();
}

function makeMove() {
    var textbox = document.getElementById("move");
    var move = textbox.value;
    if (move) movePiece(move);
    textbox.value = null;
    updateBoard();
}

function checkMove() {
    clearHighlights();
    var moves = getPossibleMoves(toIndex(document.getElementById("check").value));
    moves.forEach(function(move) {
        var square = document.getElementById(move);
        if (square) square.classList.add("highlight");
    });
}

function updateBoard() {
    for (var i = 0; i < pieces.length; i++) {
        var square = document.getElementById(i);
        if (square) square.innerHTML = (pieces[i] !== "0") ? chess_set[pieces[i]] : square.innerHTML = null;
    }
    clearHighlights();
}

function clearHighlights() {
    for (var i = 0; i < pieces.length; i++) {
        var square = document.getElementById(i);
        if (square) square.classList.remove("highlight");
    }
}


console.log("Started");