var selected_piece;
var turn = 0;

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

    var elements = document.getElementsByTagName('td');
    for (var i = 0, len = elements.length; i < len; i++) {
        elements[i].onclick = selectSquare;
    }

    updateBoard();
}

function selectSquare(square) {
    var square_id = parseInt(this.id);
    if (selected_piece) {
        var moves = getPossibleMoves(selected_piece);

        if (moves.indexOf(square_id) > -1) {
            movePiece(selected_piece, square_id);
            selected_piece = null;
            turn = 1 - turn;
            clearHighlights();
            updateBoard();
        } else {
            selected_piece = null;
            clearHighlights();
        }
    } else {
        if (pieces[square_id] !== "0" && color(pieces[square_id]) === turn) {
            selected_piece = square_id;
            checkMove(selected_piece);
        }
    }
}

function makeMove() {
    var textbox = document.getElementById("move");
    var move = textbox.value;
    var piece_index = toIndex(move.slice(0, 2));
    var square_index = toIndex(move.slice(2));

    if (move) movePiece(piece_index, square_index);
    textbox.value = null;
    updateBoard();
}

function checkMove(piece) {
    clearHighlights();
    console.log("Piece " + piece);
    var moves = (piece) ? getPossibleMoves(piece) : getPossibleMoves(toIndex(document.getElementById("check").value));
    console.log("Moves: " + moves);
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