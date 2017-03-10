const WHITE = 0;
const BLACK = 1;

var board = "1010101001010101101010100101010110101010010101011010101001010101";
// var default_pieces = "RNBQXBNROOOOOOOO00000000000000000000000000000000oooooooornbqxbnr";
var default_pieces = "RNBQX00ROOOOOOOO00000000000000000000000000000000oooooooornbqxbnr";

var chess_pieces = Array.from(default_pieces);

var files = "abcdefgh";
var white = "kxqrcbnopz";
var black = "KXQRCBNOPZ";

var chess_set = {
    "k": String.fromCharCode(9812), // Moved king
    "x": String.fromCharCode(9812), // Non moved king
    "q": String.fromCharCode(9813),
    "r": String.fromCharCode(9814), // Moved rook
    "c": String.fromCharCode(9814), // Unmoved rook
    "b": String.fromCharCode(9815),
    "n": String.fromCharCode(9816),
    "o": String.fromCharCode(9817), // Initial pawn
    "p": String.fromCharCode(9817), // Moved pawn
    "z": "", // En Passant

    "K": String.fromCharCode(9818), // Moved king
    "X": String.fromCharCode(9818), // Non moved king
    "Q": String.fromCharCode(9819),
    "R": String.fromCharCode(9820), // Moved rook
    "C": String.fromCharCode(9820), // Unmoved rook
    "B": String.fromCharCode(9821),
    "N": String.fromCharCode(9822),
    "O": String.fromCharCode(9823), // Initial pawn
    "P": String.fromCharCode(9823), // Moved pawn
    "Z": "" // En Passant
}

/**
 * toIndex(square)
 * Returns the index of the square
 * @param square {string} - The algebraic coordinates of the square (e.g. d4) 
 */
function toIndex(square) {
    var file = square[0];
    var rank = 8 - parseInt(square[1]);
    return (rank * 8 + (files.indexOf(file)));
}

/**
 * toSquare(index)
 * Converts the index to an algebraic notation text.
 * @param index {number} - The index of the square.
 */
function toSquare(index) {
    var row = Math.floor(index / 8);
    var column = index % 8;
    return (files[row] + column);
}

/**
 * movePiece(piece_index, square_index)
 * Moves the piece to the destination square, checks if the move doesn't result in check, then returns true.
 * @param piece_index {number} - The index of the piece to be moved.
 * @param square_index {number} - The index of the destination square.
 */
function movePiece(piece_index, square_index, pieces) {
    var move_pieces = pieces.slice(0);
    var piece = move_pieces[piece_index];
    var square = move_pieces[square_index];

    if ("pPoO".includes(piece) && "zZ".includes(square)) move_pieces[square_index + (1 - 2 * color(piece)) * 8] = "0";

    move_pieces = move_pieces.map(function(a) {
        if ((a === "z") || (a === "Z")) return "0";
        else return a;
    });

    move_pieces[piece_index] = "0";
    if (piece === "o" || piece === "O") {
        move_pieces[square_index] = (piece === "o") ? "p" : "P";
        if (Math.abs(Math.floor(piece_index / 8) - Math.floor(square_index / 8)) > 1) {
            move_pieces[square_index - (-1 + 2 * color(piece)) * 8] = (piece === "o") ? "z" : "Z";
        }
    } else if (piece === "x" || piece === "X") {
        move_pieces[square_index] = (piece === "x") ? "k" : "K";
        if (Math.abs(Math.floor(piece_index % 8) - Math.floor(square_index % 8)) > 1) {
            move_pieces[(piece_index > square_index) ? piece_index - 1 : piece_index + 1] = (piece === "x") ? "r" : "R";
            move_pieces[(piece_index > square_index) ? piece_index - 4 : piece_index + 3] = "0"
        }
    } else if (piece === "c" || piece === "C") {
        move_pieces[square_index] = (piece === "c") ? "r" : "R";
    } else {
        move_pieces[square_index] = piece;
    }

    return move_pieces;
}

/**
 * color(piece)
 * Returns the color of the piece
 * @param piece {string} - The string value of the piece
 */
function color(piece) {
    if (white.includes(piece)) return WHITE;
    if (black.includes(piece)) return BLACK;
    return -1;
}

/**
 * opposite_color(piece)
 * Returns the opposite color of the piece
 * @param piece {string} - The string value of the piece
 */
function opposite_color(piece) {
    if (white.includes(piece)) return BLACK;
    if (black.includes(piece)) return WHITE;
    return -1;
}

/**
 * color_direction(piece)
 * Returns the direction towards which the piece is facing relative to the board
 * @param piece {string} - The piece in question
 */
function color_direction(piece) {
    if (white.includes(piece)) return -1;
    if (black.includes(piece)) return 1;
    return 0;
}

/**
 * getPossibleMoves(pieces, index)
 * Returns an array of indexes of all the possible moves for the specified piece on the board state given in the array.
 * @param pieces {array} - The board array being checked.
 * @param index {number} - The index of the pieces being checked.
 */
function getPossibleMoves(pieces, index) {
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
                } else {
                    if (capture && color(piece) === 1 - color(pieces[move])) moves.push(move);
                    return;
                }
            } else {
                return;
            }
        }
    }

    function jump(distance, capture) {
        var n = distance;
        var a = Math.round(dy * n);
        var b = Math.round(dx * n);
        if (row + a >= 0 && row + a < 8 && column + b >= 0 && column + b < 8 && (a !== 0 && b !== 0)) {
            var move = Math.round((row + a) * 8 + column + b);
            if (pieces[move] === "0") {
                moves.push(move);
            } else {
                if (capture && color(piece) === 1 - color(pieces[move])) moves.push(move);
                return;
            }
        } else {
            return;
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

            case "x":
            case "X":
                for (var dx = -1; dx < 2; dx++) {
                    for (var dy = -1; dy < 2; dy++) {
                        vector(1, true);
                    }
                }
                if (chess_pieces[index - 4] === (turn === WHITE) ? "c" : "C") {
                    var [dx, dy] = [-2, 0];
                    vector(2, false);
                }
                if (chess_pieces[index + 3] === (turn === WHITE) ? "c" : "C") {
                    var [dx, dy] = [2, 0];
                    vector(2, false);
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
            case "c":
            case "C":
                for (var i = 0; i < 4; i++) {
                    var dx = Math.round(Math.cos(Math.PI / 2 * i));
                    var dy = Math.round(Math.sin(Math.PI / 2 * i));
                    vector(8, true);
                }
                break;

            case "n":
            case "N":
                // for (var i = 0; i < 12; i++) {
                //     var dx = Math.cos(Math.PI / 6 * i);
                //     var dy = Math.sin(Math.PI / 6 * i);
                //     jump(Math.sqrt(5), true);
                // }
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
                var dy = Math.round(Math.sin(Math.PI / 2 * i));
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

/**
 * inCheck(pieces, check_color)
 * Checks the board state to determine whether the player is in check and returns an array of indexes of threatening pieces. Returns null if not in check.
 * @param pieces {Array} The set of pieces that needs to be checked.
 * @param check_color {number} The turn of the played to be checked.
 */
function inCheck(pieces, check_color) {
    var opposite_pieces = pieces.map(function(piece, index) {
        if (check_color === WHITE) {
            if (black.includes(piece)) return index;
            else return -1;
        } else {
            if (white.includes(piece)) return index;
            else return -1;
        }
    });

    opposite_pieces = opposite_pieces.filter(function(piece) {
        return (piece !== -1)
    });
    var king_index = pieces.indexOf(check_color === WHITE ? "x" : "X");
    if (king_index === -1) king_index = pieces.indexOf(check_color === WHITE ? "k" : "K");

    for (var i = 0; i < opposite_pieces.length; i++) {
        var moves = getPossibleMoves(pieces, opposite_pieces[i]);
        if (moves.indexOf(king_index) > -1) {
            return true;
        }
    }
    return false;
}

function checkedBy(pieces, check_color) {
    var checked_by = [];
    var opposite_pieces = pieces.map(function(piece, index) {
        if (check_color === WHITE) {
            if (black.includes(piece)) return index;
            else return -1;
        } else {
            if (white.includes(piece)) return index;
            else return -1;
        }
    });

    opposite_pieces = opposite_pieces.filter(function(piece) {
        return (piece !== -1)
    });
    var king_index = pieces.indexOf(check_color === WHITE ? "x" : "X");
    if (king_index === -1) king_index = pieces.indexOf(check_color === WHITE ? "k" : "K");

    for (var i = 0; i < opposite_pieces.length; i++) {
        var moves = getPossibleMoves(pieces, opposite_pieces[i]);
        if (moves.indexOf(king_index) > -1) {
            checked_by.push(i);
        }
    }
    return checked_by;
}

/**
 * inMate(pieces, mate_color)
 * Checks whether the player is in mate.
 * @param pieces {array} - An array containing the board setup to check for mate.
 * @param mate_color {number} - The color to check for mate.
 */
function inMate(pieces, mate_color) {
    var king_index = pieces.indexOf(mate_color === WHITE ? "x" : "X");
    if (king_index === -1) king_index = pieces.indexOf(mate_color === WHITE ? "k" : "K");

    var same_pieces = pieces.map(function(piece, index) {
        if (piece !== (mate_color === WHITE ? "k" : "K")) {
            if (mate_color === WHITE) {
                if (white.includes(piece)) return index;
                else return -1;
            } else {
                if (black.includes(piece)) return index;
                else return -1;
            }
        } else {
            return -1;
        }
    });

    // Check whether the king can move out of danger
    var king_moves = getPossibleMoves(pieces, king_index);
    for (var i = 0; i < king_moves.length; i++) {
        if (!inCheck(movePiece(king_index, king_moves[i], pieces))) return false;
    }

    // Check if other pieces can prevent check
    for (var i = 0; i < same_pieces; i++) {
        var piece = same_pieces[i];
        var piece_moves = getPossibleMoves(pieces, piece);
        for (var j = 0; j < piece_moves.length; j++) {
            if (!inCheck(movePiece(piece, piece_moves[i], pieces))) return false;
        }
    }

    return true;
}


// Optional functions

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