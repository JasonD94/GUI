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
 *    Global variables for ease of use. Lazy lazy lazy but whatever.
 */


/*
    JavaScript array of objects for the amounts and value of each letter.
    I didn't make this data structure, this was originally found on Piazza and made by Ramon Meza.
    Also, I didn't feel like figuring out how to load a JSON file again so I did the easy way
    and just made a pieces array with all the stuff I need. Obviously lazy but it works way easier SO WHY NOT.

    Note that I modified this to include a "remaining" property as well, just like
    Prof. Heines showed in class for his associative array.
*/
var pieces;

// Made this a function for an easy way to reset the pieces array/objects.
function load_pieces_array() {
  pieces = [
    {"letter":"A", "value":  1,  "amount":  9,  "remaining":  9},
    {"letter":"B", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"C", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"D", "value":  2,  "amount":  4,  "remaining":  4},
    {"letter":"E", "value":  1,  "amount": 12,  "remaining": 12},
    {"letter":"F", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"G", "value":  2,  "amount":  3,  "remaining":  3},
    {"letter":"H", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"I", "value":  1,  "amount":  9,  "remaining":  9},
    {"letter":"J", "value":  8,  "amount":  1,  "remaining":  1},
    {"letter":"K", "value":  5,  "amount":  1,  "remaining":  1},
    {"letter":"L", "value":  1,  "amount":  4,  "remaining":  4},
    {"letter":"M", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"N", "value":  1,  "amount":  6,  "remaining":  6},
    {"letter":"O", "value":  1,  "amount":  8,  "remaining":  8},
    {"letter":"P", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"Q", "value": 10,  "amount":  1,  "remaining":  1},
    {"letter":"R", "value":  1,  "amount":  6,  "remaining":  6},
    {"letter":"S", "value":  1,  "amount":  4,  "remaining":  4},
    {"letter":"T", "value":  1,  "amount":  6,  "remaining":  6},
    {"letter":"U", "value":  1,  "amount":  4,  "remaining":  4},
    {"letter":"V", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"W", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"X", "value":  8,  "amount":  1,  "remaining":  1},
    {"letter":"Y", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"Z", "value": 10,  "amount":  1,  "remaining":  1},
    {"letter":"_", "value":  0,  "amount":  2,  "remaining":  2}
  ];
}

// JavaScript array of objects to determine what letter each piece is.
var game_tiles = [
  {"id": "piece0", "letter": "A"},
  {"id": "piece1", "letter": "B"},
  {"id": "piece2", "letter": "C"},
  {"id": "piece3", "letter": "D"},
  {"id": "piece4", "letter": "E"},
  {"id": "piece5", "letter": "F"},
  {"id": "piece6", "letter": "G"}
]

// JavaScript object to keep track of the game board.
// NOTE: "pieceX" means NO tile present on that drop zone.
// Also note this is EMPTY until tiles are placed onto the game board.
var game_board = [
  // Example of what WOULD be in this array. An obj with "id" of the dropable spot and the tile that was dropped.
  //{"id": "drop0",  "tile": "pieceX"},
]


// Go through the Table with the Scrabble board and fill in special spaces.
// This Stackoverflow post was handy:
// URL: https://stackoverflow.com/questions/3065342/how-do-i-iterate-through-table-rows-and-cells-in-javascript
function fill_in_table() {
  var row = 0;
  var col = 0;

  // CURRENTLY USING BACKGROUND IMAGES FOR THE SPECIAL SPACES.

  // I did not create this image.
  // Found at this URL: http://vignette3.wikia.nocookie.net/fantendo/images/4/49/Super_Star_NSMB2.png/revision/20120731024244
  $('.star').html("<img id='star_img' src='img/star.png'>");

  $('#scrabble_board tr').each(function() {
    col = 0;
    /**
     *    Note, here "$(this)" refers to the given cell we are looking at currently.
     *    This code goes through ALL cells in order, so that we can apply some properties to certain cells.
     */
    $(this).find('td').each(function() {

      // Add a unique id consisting of row#col# to the cell, where "row#" is the row number
      // and "col#" is the column number. Ex: row0col0 is the top left most cell in the table.
      // Helpful link: https://stackoverflow.com/questions/2176986/jquery-add-id-instead-of-class
      $(this).attr('id', 'row' + row + 'col' + col);
      col++;

    });
    row++;
  });
}


/**
 *      This function calls find_word(), and then determines if the word is valid
 *      or not. This will be implemented at some point using an external API
 *      or some sort of Google search thing.
 *
 *      For now all it does is display something in an ID called "le_submit"
 */
function submit_word() {
  // Call find_word to update the word.
  find_word();

  // Now just display some crap in the "le_submit" ID.
  $("#le_submit").html("<br><div class='highlight_centered_smaller'>Sorry, I have yet to find an acceptable API to use for this feature. \
  ¯\\_(ツ)_/¯ </div>");
}


/**
 *    When called, this function determine what the current word is, and prints it
 *    out to the HTML doc as well as the console for logging purposes.
 *
 *    It also determines what the score is for the word that it finds.
 *
 */
function find_word() {
  var word = "";
  var score = 0;
  var board_length = game_board.length;

  if (board_length == 0) {
    // The word is now blank.
    $("#word").html("____");
    $("#score").html(score);
  }

  // Go through the game board and generate a possible word.
  for(var i = 0; i < board_length; i++) {
    word += find_letter(game_board[i].tile);
    score += find_score(game_board[i].tile);
  }

  // Factor in the doubling of certain tiles. Since the should_double() function returns 0 or 1,
  // this is easy to account for. If it's 0, 0 is added to the score. If it's 1, the score is doubled.
  score += (score * should_double());

  // Put the score of the dropped tile into the HTML doc.
  $("#score").html(score);

  // If the word is not empty, show it on the screen!
  if(word != "") {
    $("#word").html(word);
    return;
  }

  // Otherwise the word is now blank.
  $("#word").html("____");
}


// Determine whether to double the word score or not.
// Returns 1 for YES or 0 for NO.
function should_double() {

  // NEEDS TO BE REDONE TAKING INTO ACCOUNT CLASSES DOUBLE_WORD / TRIPLE_WORD

  // if(game_board[2].tile != "pieceX") {
  //   return 1;
  // }
  // if(game_board[12].tile != "pieceX") {
  //   return 1;
  // }

  // Otherwise return 0.
  return 0;
}


/**
 *    This function, given a letter, will return the letter's score based on
 *    the value in the pieces.json file.
 *
 *    parameters: an ID of a tile
 *       returns: integer score, such as "1" or "2". On error, returns "-1".
 */
function find_score(given_id) {
  // First figure out which letter we have.
  var letter = find_letter(given_id);
  var score = 0;

  // Since each "letter" is actually a spot in an array in the pieces.json file,
  // we gotta look at each object in the array before we can look at stuff.
  for(var i = 0; i < 27; i++) {
    // Get an object to look at.
    var obj = pieces[i];

    // See if this is the right object.
    if(obj.letter == letter) {
      score = obj.value;

      // Need to determine if this piece is a DOUBLE or not.
      // Droppable zones 6 & 8 are DOUBLE letter scores.
      score += (score * should_double_letter(given_id));

      return score;
    }
  }

  // If we get here, then we weren't given a nice valid letter. >:(
  return -1;
}


// Given a tile ID, figures out which dropID this is and whether to double the
// letter score or not.
// Returns 1 for YES or 0 for NO.
function should_double_letter(given_id) {

  // THIS ALSO MUST BE REDONE. AND ADD A TRIPLE LETTER FUNCTION TOO.

  // Figure out which dropID this tile belongs to.
  // var dropID = find_tile_pos(given_id);

  // // Is this dropID a double spot or not?
  // if(dropID == "drop6" || dropID == "drop8") {
  //   // YES, return 1.
  //   return 1;
  // }

  // Otherwise, NO, so return 0.
  return 0;
}


/**
 *    This function, given a piece ID will return which letter it represents.
 *
 *    parameters: an ID of a tile
 *       returns: the letter that tile represents. On error, returns "-1".
 */
function find_letter(given_id) {

  // Go through the 7 pieces,
  for(var i = 0; i < 7; i++) {
    // If we found the piece we're looking for, awesome!
    if(game_tiles[i].id == given_id) {
      // Just return its letter!
      return game_tiles[i].letter;
    }
  }

  // If we get here, we weren't given a nice draggable ID like "piece1", so return -1
  return -1;
}


// Give this function a droppable ID and it returns which position in the array it is.
function find_board_pos(given_id) {
  for(var i = 0; i < 15; i++){
    if(game_board[i].id == given_id) {
      return i;
    }
  }

  // Errors return -1.
  return -1;
}


// Given a tile, figure out which drop_ID it belongs to.
function find_tile_pos(given_id) {
  for(var i = 0; i < 15; i++){
    if(game_board[i].tile == given_id) {
      return game_board[i].id;
    }
  }

  // Errors return -1.
  return -1;
}


/**
 *    This function loads up the scrabble pieces onto the rack.
 *    It also makes each of them draggable and sets various properties, including
 *    the images location and class / ID.
 *
 *    the tile IDs are in the form "piece#", where # is between 1 and 7.
 *
 */
function load_scrabble_pieces() {
  // I'm so used to C++ that I like defining variables at the top of a function. *shrugs*
  var base_url = "img/scrabble/Scrabble_Tile_";   // base URL of the image
  var random_num = 1;
  var piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + random_num + ".jpg" + "'></img>";
  var piece_ID = "";
  var what_piece = "";

  // Load up 7 pieces
  for(var i = 0; i < 7; i++) {
    // Get a random number so we can generate a random tile. There's 27 tiles,
    // so we want a range of 0 to 26. Also make sure not to over use any tiles,
    // so generate multiple random numbers if necessary.
    var loop = true;
    while(loop == true){
      random_num = getRandomInt(0, 26);

      // Need to make sure we remove words from the pieces data structure.
      if(pieces[random_num].amount != 0) {
        loop = false;
        pieces[random_num].amount--;
      }
    }

    // Make the img HTML and img ID so we can easily append the tiles.
    piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + pieces[random_num].letter + ".jpg" + "'></img>";
    piece_ID = "#piece" + i;
    game_tiles[i].letter = pieces[random_num].letter;

    // Reposition the tile on top of the rack, nicely in a row with the other tiles.

    // We first get the rack's location on the screen. Idea from a Stackoverflow post,
    // URL: https://stackoverflow.com/questions/885144/how-to-get-current-position-of-an-image-in-jquery
    var pos = $("#the_rack").position();

    // Now figure out where to reposition the board piece.

    /*
        IGNORE THE BOTTOM COMMENTS UNTIL I FIGURE OUT IF I LIKE HOW EVERYTHING WORKS

        HOW IT IS CURRENTLY SET UP:
        left is just +50 so everything shifts over 50 px.
        I have no idea why top works but somehow it's making stuff 50 or 70px apart.

        Some jQuery is making the tiles absolute at first, so that they don't move around when
        tiles are placed (annoying formal bug) and then when placed on a tile some more
        jquery snaps the tile to the center of the droppable target.

        Pretty fancy.


        (Even this comment isn't 100% right. Just messing with the numbers to make things look good is enough.)
    */

    // For left, I first start with the rack's left and then shift back 50 * i spaces so the tiles will line up
    // For top, I first start with the rack's top, then shift down 30 for the first tile to appear in a good spot,
    // and then I need to shift down 50 * i to make the tiles line up (see the left's 50 * i). I do 80 so that I get
    // 30px spacing between all the tiles.
    // Also all the * i does is make nothing happen when i = 0 (anything * 0 = 0 after all) and then on the next couple tiles
    // it shifts equally given the tile # we are dealing with.
    var img_left = pos.left + 90;     // THIS IS THE OLD MATH: - 30 - (40 * i);
    var img_top = pos.top + 80 + (70 * i);

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
    $(piece_ID).css("left", img_left).css("top", img_top).css("position", "absolute");

    // Make the piece draggable.
    $(piece_ID).draggable({
      appendTo: scrabble_board,
      revert: "invalid",
      start: function(ev, ui) {
        // Stackoverflow post: https://stackoverflow.com/questions/3948447/jquery-ui-droppable-only-accept-one-draggable
        $('.ui-droppable').each(function(i, el) {
          if (!$(el).find('.ui-draggable').length) $(el).droppable('enable');
        });
      }
    });
  }
}


/**
 *      This function resets the game board.
 *      It does so by reusing several functions:
 *      load_pieces_array()       -> resets the pieces array
 *      reset_tiles()             -> removes all the tiles on the screen.
 *      load_scrabble_pieces()    -> loads up new tiles.
 *      find_word()               -> resets what the word looked like.
 */
function reset_tiles() {
  console.log("Resetting the game board! Buckle up!");

  // First clear the game board array.
  game_board = [];    // Easy way of doing this.
  // URL for more ways of doing this: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript

  // Now reset the pieces array.
  load_pieces_array();

  // Remove all the scrabble tiles on the board / in the rack.
  for(var i = 0; i < 7; i++) {
    var tileID = '#' + game_tiles[i].id;
    $(tileID).draggable("destroy");    // Destroys the draggable element.
    $(tileID).remove();                // Removes the tile from the page.
    // URL for more info: https://stackoverflow.com/questions/11452677/jqueryui-properly-removing-a-draggable-element
  }

  // Load up some new Scrabble pieces!
  load_scrabble_pieces();

  // Resets the HTML "Word: " and "Score: " display.
  find_word();    // Technically this returns -1 and just wipes the display clean.

  // Reset the "submit_word" div, just in case the user tried to submit the word.
  $("#le_submit").html("");

  // Now we're done! Woot!
  return;
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

  // Make the rack droppable for placing tiles back if you don't want them.
  $("#the_rack").droppable( {

  });

  $("#scrabble_board td").droppable({
    accept: ".ui-draggable",
    appendTo: "body",
    drop: function(event, ui) {
      // To figure out which draggable / droppable ID was activated, I used this sweet code
      // from stackoverflow:
      // https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
      var draggableID = ui.draggable.attr("id");
      var droppableID = $(this).attr("id");

      // For debugging purposes.
      console.log("draggableID: " + draggableID );
      console.log("droppableID: " + droppableID );

      /*
            Logic needed here to prevent multiple tiles on the space spot,
            and to determine if a tile drop is legal or not.

       */

      // Get board array length. This will be useful for our checks next.
      var gameboard_length = game_board.length;

      // Add the current items to the game board array.
      // Style should be like: {"id": "drop0",  "tile": "pieceX"},
      var obj = {};
      obj['id'] = droppableID;          // testing
      obj['tile'] = draggableID;

      // does this work?
      game_board.push(obj);

      console.log("Array looks like: " + game_board);

      // Empty array check.
      if (gameboard_length == 0) {
        console.log("Any placement is allowed.");

      }
      else {
        if(gameboard_length == 1) {
          // Disable diagonal placement.
          // TO DO: ALGORITHM FOR DIAGONALS.
          /*
              Example:

              X*X
              *+*
              X*X

              X = not allowed
              * = allowed
              + = current location
          */

          console.log("Diagonals are not allowed.");
        }
        else {
          // Now there should only be up and down placement.
          console.log("Only up and down should be allowed.");
        }
      }


      // This makes it so only the given tile may be dropped on the current spot.
      // See this Stackoverflow post for more info: https://stackoverflow.com/questions/3948447/jquery-ui-droppable-only-accept-one-draggable
      //$(this).droppable('option', 'accept', ui.draggable);
      $(this).droppable('disable');

      // This from Stackoverflow, it snaps to where it was dropped.
      // URL: https://stackoverflow.com/questions/30122234/how-to-make-an-accept-condition-for-droppable-td-to-accept-only-the-class-within
      $(this).append($(ui.draggable));
      ui.draggable.css("top", $(this).css("top"))
      ui.draggable.css("left", $(this).css("left"))
      ui.draggable.css("position", "relative")

      // Update the word as it stands now.
      find_word();
    },
    out: function(event, ui) {
      // Now we need to remove the piece from the game_board array...
      // Use its ID if possible to find it and do a .remove()
    },
    zIndex: -1
  });




/*  for(var i = 0; i < 15; i++) {
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
      // When a tile is placed on a droppable zone, set the game_board var to hold that tile.
      drop: function(event, ui) {
        // To figure out which draggable / droppable ID was activated, I used this sweet code
        // from stackoverflow:
        // https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
        var draggableID = ui.draggable.attr("id");
        var droppableID = $(this).attr("id");

        // Log this stuff for debugging.
        console.log("Tile: " + draggableID + " - dropped on " + droppableID);

        // Mark that a tile was dropped in the game_board variable.
        game_board[find_board_pos(droppableID)].tile = draggableID;

        // Figure out what word, if any, the user currently entered.
        find_word();
      },
      // When a tile is moved away, gotta remove it from the game board.
      // Helpful info: https://api.jqueryui.com/droppable/#event-out
      out: function(event, ui) {
        var draggableID = ui.draggable.attr("id");
        var droppableID = $(this).attr("id");

        // See if this is a false alarm - someone moving tiles over this one by mistake.
        // This is necessary to prevent "removing" of tiles by accident if another tile
        // clips one that isn't being removed.
        if(draggableID != game_board[find_board_pos(droppableID)].tile) {
          // We found that someone did not actually move the tile outside of
          // the drop zone, so this was clearly a mistake (clipping issue likely)
          // So just log it and return to prevent accidently removing a valid tile.
          console.log("FALSE ALARM DETECTED.");
          return;
        }

        // Log this stuff for debugging.
        console.log("Tile: " + draggableID + " - removed from " + droppableID);

        // Mark that a tile was removed in the game_board variable.
        game_board[find_board_pos(droppableID)].tile = "pieceX";

        // Update the word that was just found.
        find_word();
      }
    });
  }*/
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