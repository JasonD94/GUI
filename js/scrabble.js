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

/**
 *    This function loads up the scrabble pieces onto the rack.
 *    It also makes each of them draggable and sets various properties, including
 *    the images location and class / ID.
 *
 *    the tile IDs are in the form "piece#", where # is between 1 and 7.
 *
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
    // For left, the -200 shifts the tiles over 200px from the edge of the rack. the (50 * i) creates 50px gaps between tiles.
    // For top, the -130 shifts the tiles up 130px from the bottom of the rack.
    var img_left = -200 + (50 * i);
    var img_top = -130;

    /* Load onto the page and make draggable.
       The height / width get set using these tricks:
       https://stackoverflow.com/questions/10863658/load-image-with-jquery-and-append-it-to-the-dom
       https://stackoverflow.com/questions/2183863/how-to-set-height-width-to-image-using-jquery
       https://stackoverflow.com/questions/9704087/jquery-add-image-at-specific-co-ordinates

       The relative stuff came from this w3schools page. I realized I could set the top and left
       relative to the rack (and the board for the droppable targets), which makes things wayyyyy
       easier. URL: http://www.w3schools.com/css/css_positioning.asp
    */
    // Add the piece to the screen
    $("#rack").append(piece);

    // Move the piece relative to where the rack is located on the screen.
    $(piece_ID).css("left", img_left).css("top", img_top).css("position", "relative");

    // Make the piece draggable.
    $(piece_ID).draggable();
  }
}

/**
 *    This function will load up targets for the images to be dropped onto.
 *    I figure they will be transparent images that are overlayed on top of
 *    the game board.
 *
 *    TODO: figure out the size of these targets - maybe 50px by 50px?
 *          also create transparent image of that size to load up.
 *          should probabl
 *
 *    height should be 80px
 *    width should be 75px
 */
function load_droppable_targets() {
  var img_url = "img/scrabble/Scrabble_Droppable.png";   // URL of the image
  var drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
  var drop_ID = "#drop" + i;

  for(var i = 1; i < 16; i++) {
    drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
    drop_ID = "#drop" + i;

    // ** The position stuff is similar to the tile function above. **
    // Get board location.
    var pos = $("#the_board").position();

    // Figure out where to put the droppable targets.
    var img_left = 0;
    var img_top = -125;

    // Add the img to the screen.
    $("#board").append(drop);

    // Reposition the img relative to the board.
    $(drop_ID).css("left", img_left).css("top", img_top).css("position", "relative");

    // Make the img droppable
    $(drop_ID).droppable({
      // Found this on the jQuery UI doc page, at this URL: https://jqueryui.com/droppable/#default
      drop: function(event, ui) {
        // To figure out which draggable / droppable ID was activated, I used this sweet code
        // from stackoverflow:
        // https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
        var draggableID = ui.draggable.attr("id");
        var droppableID = $(this).attr("id");
        $("#score").html("Tile: " + draggableID + " - dropped on " + droppableID);
      }
    });
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