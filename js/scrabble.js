/*
    File: ~/js/scrabble.js
    91.461 Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
    Jason Downing - student at UMass Lowell in 91.461 GUI Programming I
    Contact: jdowning@cs.uml.edu or jason_downing@student.uml.edu
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Nov 24, 2015.
    Last Updated: Nov 24, 1:30PM.

    This JavaScript file is for the 9th assignment, "Scrabble".
*/

function load_scrabble_pieces() {
  var base_url = "img/scrabble/Scrabble_Tile_";   // base URL of the image
  var tiles = [ "A", "B", "C", "Blank", "D", "E", "F", "G", "H", "I", "J", "K", "L",
                "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var random_num = 1;
  var piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + random_num + ".jpg" + "'></img>";
  var piece_ID = "";

  // Load up 7 pieces
  for(var i = 1; i < 8; i++) {
    // Get a random number so we can generate a random tile. There's 27 tiles,
    // so we want a range of 0 to 26.
    random_num = getRandomInt(0, 26);

    // Make the img HTML and img ID so we can easily append the tiles.
    piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + tiles[random_num] + ".jpg" + "'></img>";
    piece_ID = "#piece" + i;

    // Reposition the tile on top of the rack, nicely in a row with the other tiles.
    // We first get the rack's location on the screen. Idea from a Stackoverflow post,
    // URL: https://stackoverflow.com/questions/885144/how-to-get-current-position-of-an-image-in-jquery
    var pos = $("#the_rack").position();

    // Now figure out where to reposition the board piece.
    // The "50 * i" part just moves the image over X number of 50px blocks. Basically it
    // adjusts the pieces so they are in a nice line vs all on top of each other.
    // The -75 just makes it line up better on the far left side with the rack.
    var img_left = pos.left + -50 + (150 * i);
    var img_top = pos.top + 10;

    // Load onto the page and make draggable.
    // The height / width get set using these tricks:
    // https://stackoverflow.com/questions/10863658/load-image-with-jquery-and-append-it-to-the-dom
    // https://stackoverflow.com/questions/2183863/how-to-set-height-width-to-image-using-jquery
    $("#rack").append(piece);
    $(piece_ID).css("left", img_left).css("top", img_top).css("position", "absolute").draggable();
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 *
 * I did not originally write this, it is from this Stackoverflow post:
 * URL: https://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}