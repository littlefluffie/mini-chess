var board = "1010101001010101101010100101010110101010010101011010101001010101";
var default_pieces = "RNBQKBNRPPPPPPPP00000000000000000000000000000000pppppppprnbqkbnr";
// var default_pieces = "000000000000000000000000000n000000000000000000000000000000000000";

var pieces = Array.from(default_pieces);
var files = "abcdefgh";
var white = "kqrbnp";
var black = "KQRBNP";

var chess_set = {
    "k": String.fromCharCode(9812),
    "q": String.fromCharCode(9813),
    "r": String.fromCharCode(9814),
    "b": String.fromCharCode(9815),
    "n": String.fromCharCode(9816),
    "p": String.fromCharCode(9817),
    "K": String.fromCharCode(9818),
    "Q": String.fromCharCode(9819),
    "R": String.fromCharCode(9820),
    "B": String.fromCharCode(9821),
    "N": String.fromCharCode(9822),
    "P": String.fromCharCode(9823)
}

function toIndex(notation) {
    var file = notation[0];
    var rank = 8 - parseInt(notation[1]);
    return (rank * 8 + (files.indexOf(file)));
}

function movePiece(piece_index, square_index) {
    var piece = pieces[piece_index];
    pieces[piece_index] = "0";
    pieces[square_index] = piece;
    return displayBoard();
}

function getLegalMoves(index) {
    var piece = pieces[index];
    if (piece !== "0") {

    }
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

    function vector(distance) {
        for (var n = 1; n < distance; n++) {
            if (row + (dy * n) >= 0 && row + (dy * n) < 8 && column + (dx * n) >= 0 && column + (dx * n) < 8) {
                var move = (row + (dy * n)) * 8 + column + (dx * n);
                if (pieces[move] === "0") {
                    moves.push(move);
                } else {
                    if (color(piece) === 1 - color(pieces[move])) moves.push(move);
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
                        vector(1);
                    }
                }
                break;

            case "q":
            case "Q":
                for (var dx = -1; dx < 2; dx++) {
                    for (var dy = -1; dy < 2; dy++) {
                        vector(9);
                    }
                }
                break;

            case "r":
            case "R":
                for (var i = 0; i < 4; i++) {
                    var dx = Math.cos(Math.PI / 2 * i);
                    var dy = Math.sin(Math.PI / 2 * i);
                    vector(9);
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
                        vector(9);
                    }
                }
                break;

            case "p":
            case "P":
                var move = (row - 1) * 8 + column;
                if (pieces[move] === "0") moves.push(move);
                var move = (row - 2) * 8 + column;
                if (pieces[move] === "0") moves.push(move);
                var move = (row - 1) * 8 + column + 1;
                if (pieces[move] !== "0" && color(pieces[move] === 1 - color(piece))) moves.push(move);
                var move = (row - 1) * 8 + column - 1;
                if (pieces[move] !== "0" && color(pieces[move] === 1 - color(piece))) moves.push(move);
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