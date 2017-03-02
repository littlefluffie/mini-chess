var board = "1010101001010101101010100101010110101010010101011010101001010101";
var default_pieces = "RNBQKBNROOOOOOOO00000000000000000000000000000000oooooooornbqkbnr";
// var default_pieces = "000000000000000000000000000n000000000000000000000000000000000000";

var pieces = Array.from(default_pieces);
var files = "abcdefgh";
var white = "kqrbnopz";
var black = "KQRBNOPZ";

var chess_set = {
    "k": String.fromCharCode(9812),
    "q": String.fromCharCode(9813),
    "r": String.fromCharCode(9814),
    "b": String.fromCharCode(9815),
    "n": String.fromCharCode(9816),
    "o": String.fromCharCode(9817), // Initial pawn
    "p": String.fromCharCode(9817), // Moved pawn
    "z": "", // En Passant

    "K": String.fromCharCode(9818),
    "Q": String.fromCharCode(9819),
    "R": String.fromCharCode(9820),
    "B": String.fromCharCode(9821),
    "N": String.fromCharCode(9822),
    "O": String.fromCharCode(9823), // Initial pawn
    "P": String.fromCharCode(9823), // Moved pawn
    "Z": "" // En Passant
}

function toIndex(notation) {
    var file = notation[0];
    var rank = 8 - parseInt(notation[1]);
    return (rank * 8 + (files.indexOf(file)));
}

function movePiece(piece_index, square_index) {
    pieces = pieces.map(function(a) {
        if ((a === "z") || (a === "Z")) return "0";
        else return a;
    });

    var piece = pieces[piece_index];
    pieces[piece_index] = "0";
    if (piece === "o" || piece === "O") {
        pieces[square_index] = (piece === "o") ? "p" : "P";
        pieces[square_index - (-1 + 2 * color(piece)) * 8] = (piece === "o") ? "z" : "Z";
    } else {
        pieces[square_index] = piece;
    }

    return displayBoard();
}

function color(piece) {
    if (white.includes(piece)) return 0;
    if (black.includes(piece)) return 1;
    return -1;
}

function getPossibleMoves(index) {

    var moves = [];

    var piece = pieces[index];
    var row = Math.floor(index / 8);
    var column = index % 8;

    function vector(distance, capture) {
        for (var n = 1; n < distance + 1; n++) {
            if (row + (dy * n) >= 0 && row + (dy * n) < 8 && column + (dx * n) >= 0 && column + (dx * n) < 8) {
                var move = (row + (dy * n)) * 8 + column + (dx * n);
                if (pieces[move] === "0") {
                    if ("pPoO".includes(piece) && capture) return;
                    else moves.push(move);
                } else if ((pieces[move] === "z" || pieces[move] === "Z") && color(piece) === 1 - color(pieces[move])) {
                    moves.push(move);
                    pieces[move + (1 - 2 * color(piece)) * 8] = "0";
                } else {
                    if (capture && color(piece) === 1 - color(pieces[move])) moves.push(move);
                    return;
                }
            } else {
                return;
            }
        }
    }

    if (piece !== "0") {
        switch (piece) {
            case "k":
            case "K":
                for (var dx = -1; dx < 2; dx++) {
                    for (var dy = -1; dy < 2; dy++) {
                        vector(1, true);
                    }
                }
                break;

            case "q":
            case "Q":
                for (var dx = -1; dx < 2; dx++) {
                    for (var dy = -1; dy < 2; dy++) {
                        vector(8, true);
                    }
                }
                break;

            case "r":
            case "R":
                for (var i = 0; i < 4; i++) {
                    var dx = Math.cos(Math.PI / 2 * i);
                    var dy = Math.sin(Math.PI / 2 * i);
                    vector(8, true);
                }
                break;

            case "n":
            case "N":
                for (var i = -2; i < 3; i++) {
                    if (i !== 0 && row + i >= 0 && row + i < 8 && column + 3 - Math.abs(i) >= 0 && column + 3 - Math.abs(i) < 8) {
                        var move = (row + i) * 8 + column + (3 - Math.abs(i));
                        if (pieces[move] === "0") {
                            moves.push(move);
                        } else {
                            if (color(piece) === 1 - color(pieces[move])) moves.push(move);
                        }
                    }

                    if (i !== 0 && row + i >= 0 && row + i < 8 && column - (3 - Math.abs(i)) >= 0 && column - (3 - Math.abs(i)) < 8) {
                        var move = (row + i) * 8 + column - (3 - Math.abs(i));
                        if (pieces[move] === "0") {
                            moves.push(move);
                        } else {
                            if (color(piece) === 1 - color(pieces[move])) moves.push(move);
                        }
                    }
                }
                break;

            case "b":
            case "B":
                for (var dx = -1; dx < 2; dx += 2) {
                    for (var dy = -1; dy < 2; dy += 2) {
                        vector(9, true);
                    }
                }
                break;

            case "o":
            case "O":
                var i = -1 + 2 * color(piece);
                var dx = Math.floor(Math.cos(Math.PI / 2 * i));
                var dy = Math.floor(Math.sin(Math.PI / 2 * i));
                vector(2, false);

                var dy = i;

                var dx = 1;
                vector(1, true);

                var dx = -1;
                vector(1, true);

                break;

            case "p":
            case "P":
                var i = -1 + 2 * color(piece);
                var dx = 0;
                var dy = Math.floor(Math.sin(Math.PI / 2 * i));
                vector(1, false);

                var dy = i;
                var dx = 1;
                vector(1, true);

                var dx = -1;
                vector(1, true);

                break;

            default:
                break;
        }

        return moves;
    }
}


// Optional functions

function displayBoard() {
    var output = "";
    for (var i = 0; i < pieces.length; i++) {
        output += (pieces[i] !== "0") ? chess_set[pieces[i]] : board[i];
        if ((i + 1) % 8 === 0 && i !== pieces.length) output += "\n";
    }
    return output;
}

function generateBoard() {
    var board = "";
    for (var i = 0; i < 8; i++) {
        var file = "";
        for (var j = 0; j < 8; j++) {
            file += (j + (i % 2)) % 2 ? String.fromCharCode(9608) : String.fromCharCode(9618);
        }
        board += file;
    }
    return board;
}