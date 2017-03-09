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
    clearSelected();
    var square_id = parseInt(this.id);
    if (color(chess_pieces[square_id]) === turn) {
        var selected = document.getElementById(square_id);
        if (selected) selected.classList.add("selected");
    }

    if (selected_piece) {
        var moves = getPossibleMoves(chess_pieces, selected_piece);

        if (moves.indexOf(square_id) > -1) {
            var [success, check] = movePiece(selected_piece, square_id);
            if (success) {
                selected_piece = null;
                turn = 1 - turn;
                if (inCheck(chess_pieces, turn) !== null) alert("Check");
                clearHighlights();
                updateBoard();
            } else {
                alert("You cannot move into check");
                clearHighlights();
            }
        } else {
            selected_piece = null;
            clearHighlights();
        }
    } else {
        if (chess_pieces[square_id] !== "0" && color(chess_pieces[square_id]) === turn) {
            selected_piece = square_id;
            checkMove(selected_piece);
        }
    }
}

function checkMove(piece) {
    clearHighlights();
    var moves = getPossibleMoves(chess_pieces, piece);
    moves.forEach(function(move) {
        var square = document.getElementById(move);
        if (square) square.classList.add("highlight");
    });
}

function updateBoard() {
    for (var i = 0; i < chess_pieces.length; i++) {
        var square = document.getElementById(i);
        if (square) square.innerHTML = (chess_pieces[i] !== "0") ? chess_set[chess_pieces[i]] : square.innerHTML = null;
    }
    clearHighlights();
    clearSelected();
}

function clearHighlights() {
    for (var i = 0; i < chess_pieces.length; i++) {
        var square = document.getElementById(i);
        if (square) square.classList.remove("highlight");
    }
}

function clearSelected() {
    for (var i = 0; i < chess_pieces.length; i++) {
        var square = document.getElementById(i);
        if (square) square.classList.remove("selected");
    }
}

function checkPieces() {
    alert(JSON.stringify(chess_pieces));
}


console.log("Started");