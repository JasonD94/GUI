/*
    File: ~/js/scrabble_v2.js
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

var left_right = false;   /* Boolean for reading left to right or top to bottom */

var number_of_words = 0;  /* For detecting multiple words played. */

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
    {"letter":"_", "value":  0,  "amount":  0,  "remaining":  0}    // Temporary set to 0 until I implement this.
  ];                                                                // Normally 2 should be in the array.
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

// URL for this source code: http://ejohn.org/blog/dictionary-lookups-in-javascript/
// See the "Submit word" function for more info.
// The dictionary lookup object
// Also, future note, a better dictionary file might be found here:
// http://www.math.sjsu.edu/~foster/dictionary.txt
var dict = {};

// Do a jQuery Ajax request for the text dictionary
$.get( "files/dictionary.txt", function( txt ) {
    // Get an array of all the words
    var words = txt.split( "\n" );

    // And add them as properties to the dictionary lookup
    // This will allow for fast lookups later
    for ( var i = 0; i < words.length; i++ ) {
        dict[ words[i] ] = true;
    }
});

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
      $(this).attr('id', 'row' + row + '_' + 'col' + col);
      col++;

    });
    row++;
  });
}


/**
 *      This function will update the "Letters Remaining" table.
 *      The table has 3 rows of 9 cells, but the very last cell (row 3, cell 9)
 *      is empty and should remain empty.
 *
 *      URL for info on this function:
 *      https://stackoverflow.com/questions/3065342/how-do-i-iterate-through-table-rows-and-cells-in-javascript
 *
 */
function update_remaining_table() {
  var x = 0;
  var first = true;

  // Go through every cell in the table and update it.
  $('#letters_remain tr').each(function() {

    // DO NOT go over the limit of the array! Currently there is 27 elements in the
    // array. So we should stop at 27, since we are going 0 to 26.
    // Make sure to return false for this to work (THANK YOU STACKOVERFLOW)
    // URL for that amazing tip: https://stackoverflow.com/questions/1784780/how-to-break-out-of-jquery-each-loop
    if (x > 26) {
      // Quit before bad things happen.
      return true;
    }

    $(this).find('td').each(function() {
      // Skip the first row, we don't want to mess with it.
      if (first == true) {
        first = false;
        return false;
      }

      // DO NOT go over the limit of the array! Currently there is 27 elements in the
      // array. So we should stop at 27, since we are going 0 to 26.
      if (x > 26) {
        // Quit before bad things happen.
        return false;
      }

      // Easier to use variables for this stuff.
      var letter = pieces[x].letter;
      var remaining = pieces[x].remaining;

      // Using "$(this)" access each cell.
      $(this).html(letter + ": " + remaining);

      x++;    // Keep looping
      return true;
    });
    return true;
  });

  return true;
}


/**
 *      This function calls find_word(), and then determines if the word is valid
 *      or not. This will be implemented at some point using an external API
 *      or some sort of Google search thing.
 *
 *      I used an awesome website to figure this one out, so just check out the
 *      this URL for details: http://ejohn.org/blog/dictionary-lookups-in-javascript/
 *
 */
function submit_word() {
  // Call find_word to update the word.
  find_word();

  var word = $("#word").html();

  // The user needs to play a tile first...
  if (word == "____") {
    // User isn't so smart. Tell them to try again.
    $("#le_submit").html("<br><div class='highlight_centered_error'> \
    Sorry, but you need to play a tile before I can check the word for you!</div>");
    console.log("Please play some tiles first.");
    return -1;
  }

  // Make sure the word is lower cased or it might not be found in the dictionary!
  word = word.toLowerCase();

  /*

      The following is taken from this awesome website. I got the dictionary file off
      my Linux OS, and it was found in "/usr/share/dict/words". It actually redirected me
      to "/etc/dictionaries-common/words" on Ubuntu 14.04 LTS. But I opened it in Sublime text
      anyway and saved it to my GitHub.

      URL for the source code: http://ejohn.org/blog/dictionary-lookups-in-javascript/
  */

  // Let's see if our word is in the dictionary.
  if ( dict[ word ] ) {
    // If it is, AWESOME! The user is so smart.
    $("#le_submit").html("<br><div class='highlight_centered_success'> \
    Nice job! \"" + word + "\" is considered a word by the game's dictionary!<br><br> \
    <button class='smaller_button' onclick='save_word();'>Save Word & Play Again.</button><br><br></div>");
    console.log("Hey! That's a legit word! NICE JOB!");
    return 1;
  }
  else {
    // User isn't so smart. Tell them to try again.
    $("#le_submit").html("<br><div class='highlight_centered_error'> \
    Sorry. \"" + word + "\" is not a word in the English dictionary. \
    I suggest trying a different word. Or try resetting your tiles and trying again.</div>");
    console.log("Sorry, that doesn't seem to be a word.");
    return -1;
  }

}


/**
 *    This function will (when implemented) save the currently played word / score
 *    and provide the user with new tiles to play with. This will let them play
 *    as many words as they would like and keep their score as well.
 *
 */
function save_word() {
  // Currently this function does nothing but make a popup using Sweetalerts.
  // JUST A PLACE HOLDER / TROLL.
  sweetAlert("NOT IMPLEMENTED", "¯\\_(ツ)_/¯", "error");
  swal({
    title: "NOT IMPLEMENTED YET.",
    text: "¯\\_(ツ)_/¯",
    imageUrl: "img/its_happening.gif",
    imageSize: "312x213",
    allowOutsideClick: "true"
  });
}


/**
 *    When called, this function determine what the current word is, and prints it
 *    out to the HTML doc as well as the console for logging purposes.
 *
 *    It also determines what the score is for the word that it finds.
 *
 */
function find_word(read_left) {
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
  score += (score * should_double_triple_word());

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


// Determine whether to double or triple the word score or not.
// Returns 1 or 2 for YES and 0 for NO.
function should_double_triple_word() {
  // Get board array length. This will be useful for our checks next.
  var gameboard_length = game_board.length;

  // Go through the game board and see if any spots have the
  // class "double_word" or "triple_word"
  for (var i = 0; i < gameboard_length; i++) {
    var space_ID = "#" + game_board[i].id

    // Debugging
    // console.log("space_ID = " + space_ID);

    if ( $(space_ID).hasClass('double_word') == true ) {
      // Sweet! Double the word's value!
      console.log("Doubling word value.");
      return 1;
    }
    else if ( $(space_ID).hasClass('triple_word') == true ) {
      // SWEET! IT'S A TRIPLE!
      console.log("Tripling word value");
      return 2;
    }
  }

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
      var extra = score * should_double_triple_letter(given_id);
      score = score + extra;

      return score;
    }
  }

  // If we get here, then we weren't given a nice valid letter. >:(
  return -1;
}


// Given a tile ID, figures out which dropID this is and whether to double the
// letter score or not.
// Returns 2 or 3 for YES or 1 for NO.
function should_double_triple_letter(given_id) {
  var space;

  for(var i = 0; i < game_board.length; i++) {
    if(game_board[i].tile == given_id){
      space = "#" + game_board[i].id;
    }
  }

  // Debugging
  //console.log("Space is: " + space);

  if ( $(space).hasClass("double_letter") == true ) {
    // Sweet! Double the letter's value!
    console.log("Doubling letter's value.");
    return 1;
  }
  else if ( $(space).hasClass("triple_letter") == true ) {
    // SWEET! IT'S A TRIPLE!
    console.log("Tripling letter's value.");
    return 2;
  }

  // Otherwise return 1.
  return 0;
}


/*
      Get's row / col index for given droppableID
 */
function find_table_position(droppableID) {

  // Figure out the row / col
  var test = String(droppableID).split('_');    // URL: https://stackoverflow.com/questions/96428/how-do-i-split-a-string-breaking-at-a-particular-character
  var row = String(test[0]).split('row');
  row = row[1];
  var col = String(test[1]).split('col');
  col = col[1];

  var arry = [];
  arry.push(row);
  arry.push(col);

  // Debugging
  console.log(arry);

  // Return the row / col in an array.
  return arry;
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
      if(pieces[random_num].remaining != 0) {
        loop = false;
        pieces[random_num].remaining--;
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

    var img_left = pos.left + 30 + (50 * i);      // This controls left to right placement.
    var img_top = pos.top + 30;                   // This controls top to bottom placement.

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
      revert: "invalid",            // This is key. Only the rack and game board are considered valid!
                                    // HA, try dropping the game pieces where ever you want!
      start: function(ev, ui) {
        // Stackoverflow post: https://stackoverflow.com/questions/3948447/jquery-ui-droppable-only-accept-one-draggable
        $('.ui-droppable').each(function(i, el) {
          if (!$(el).find('.ui-draggable').length) {
            $(el).droppable('enable');
          }
        });
      },
      stop: function() {
        // If an invalid event is found, this will return the draggable object to its
        // default "invalid" option. From this Stackoverflow post (also used in the droppable part.)
        $(this).draggable('option','revert','invalid');
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
  console.log("Resetting the game board!");

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

  // Update the "Letters Remaining" table.
  update_remaining_table();

  // Reset the "submit_word" div, just in case the user tried to submit the word.
  $("#le_submit").html("");

  // Now we're done! Woot!
  return;
}


/*
 *    This function will reset the entire game board.
 */
function reset_game_board() {
  // Currently this function does nothing but make a popup using Sweetalerts.
  // JUST A PLACE HOLDER / TROLL.
  sweetAlert("NOT IMPLEMENTED", "¯\\_(ツ)_/¯", "error");
  swal({
    title: "NOT IMPLEMENTED YET.",
    text: "¯\\_(ツ)_/¯",
    imageUrl: "img/its_happening.gif",
    imageSize: "312x213",
    allowOutsideClick: "true"
  });
}


/**
 *    This function will load up targets for the images to be dropped onto.
 *    I figure they will be transparent images that are overlayed on top of
 *    the game board.
 */
function load_droppable_targets() {

  // Make the rack droppable for placing tiles back if you don't want them.
  $("#the_rack").droppable( {
    accept: ".ui-draggable",
    appendTo: "body",
    drop: function(event, ui) {
      var draggableID = ui.draggable.attr("id");
      var droppableID = $(this).attr("id");

      // Get board array length. This will be useful for our checks next.
      var gameboard_length = game_board.length;

      // See if this element is in the array and at the beginning or end.
      for(var i = 0; i < gameboard_length; i++) {
        if (game_board[i].tile == draggableID) {
          console.log("Found the object to remove!");

          // Make the spot droppable again.
          var spot_id = "#" + game_board[i].id;
          $(spot_id).droppable("enable");

          // We found it! Remove it from the game board array.
          // URL for this help: https://stackoverflow.com/questions/5767325/remove-a-particular-element-from-an-array-in-javascript
          game_board.splice(i, 1);

          // Update the word & score.
          find_word();

          // This trick comes from Stackoverflow.
          // URL: https://stackoverflow.com/questions/849030/how-do-i-get-the-coordinate-position-after-using-jquery-drag-and-drop

          // NEW WAY - WORKS WAAAAAAY BETTER THAN MAKING THE TILE FLY ACROSS THE SCREEN!
          var currentPos = ui.helper.position();
          var posX = parseInt(currentPos.left);
          var posY = parseInt(currentPos.top);

          // Move the draggable image so it doesn't fly around randomly like to the bottom of the screen or whatever.
          ui.draggable.css("left", posX);        // The +60 just makes the draggable object not fly to the left for some reason.
          ui.draggable.css("top", posY);
          ui.draggable.css("position", "absolute");

          // Move the tile over to the rack. Prevents weird bugs where the table changes sizes and thinks there's two tiles in one spot.
          $('#rack').append($(ui.draggable));

          // Quit now.
          return;
        }
      }
    }
  });

  $("#scrabble_board td").droppable({
    accept: ".ui-draggable",
    appendTo: "body",
    drop: function(event, ui) {
      // To figure out which draggable / droppable ID was activated, I used this sweet code from stackoverflow:
      // https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
      var draggableID = ui.draggable.attr("id");
      var droppableID = $(this).attr("id");
      var duplicate = false;
      var dup_index = 0;
      var insert_beg = false;
      var star_spot = "row7_col7";      // Star in the middle of the board.

      // For debugging purposes.
      console.log("draggableID: " + draggableID );
      console.log("droppableID: " + droppableID );

      // Get board array length. This will be useful for our checks next.
      var gameboard_length = game_board.length;

      // See if this is a duplicate
      for (var i = 0; i < gameboard_length; i++) {
        if (game_board[i].tile == draggableID) {
          // We've got a duplicate.
          console.log("Found a duplicate! ");
          duplicate = true;
          dup_index = i;      // Save the index for later.
        }
      }

      if (gameboard_length == 0) {
        console.log("Must start at the star.");

        /* The only valid place is the star, row7_col7 */

      }

      if (gameboard_length == 1 || (gameboard_length == 2 && duplicate == true) ) {
        console.log("Diagonals are not allowed.");

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

        // If we get here, we should determine what the index is of our current
        // tile. Then we can use some math to determine what moves are allowed.
        var past_pos = find_table_position(game_board[0].id);
        var cur_pos = find_table_position(droppableID);

        // Debugging
        console.log("Past pos = " + past_pos + " Proposed position: " + cur_pos);

        /*  If this was 7,7 then the allowed positions would be:

            (6,7) & (8,7) => allowed, left to right read.
            (7,6) & (7,8) => allowed, top to bottom read.

            this could be written as past_pos needing to be equal to:
            (cur_pos[0] - 1, cur_pos[1]) & (cur_pos[0] + 1, cur_pos[1])   -> l/r
            or
            (cur_pos[0], cur_pos[1] - 1) & (cur_pos[0], cur_pos[1] + 1)   -> t/b
        */
        allowed_arrays = [
          [ parseInt(past_pos[0]) - 1, past_pos[1] ],     // these two are l / r
          [ parseInt(past_pos[0]) + 1, past_pos[1] ],
          [ past_pos[0], parseInt(past_pos[1]) - 1],     // these two are t / b
          [ past_pos[0], parseInt(past_pos[1]) + 1]
        ];

        // Debugging
        console.log("allowed positions are: " + allowed_arrays[0] + ' & ' + allowed_arrays[1] + ' & ' + allowed_arrays[2] + ' & ' + allowed_arrays[3]);

        // See if we have one of the allowed positions.
        var test = cur_pos.toString();
        if (test == allowed_arrays[0].toString() || test == allowed_arrays[1].toString() ) {
          // Yeah! And it's top to bottom!
          console.log("Allowed. T/B");
          left_right = false;

          // Need to insert at the front if we're inserting at the top.
          if (test == allowed_arrays[0].toString()) {
            console.log("Inserting at the beginning of the game board array.");
            insert_beg = true;
          }
        }
        else if (test == allowed_arrays[2].toString() || test == allowed_arrays[3].toString() ) {
          // Yep! And it's left to right too!
          console.log("Allowed. L/R");
          left_right = true;

          // Need to insert at the front if we're inserting from the left.
          if (test == allowed_arrays[2].toString()) {
            insert_beg = true;
          }
        }
        else {
          console.log("NOT ALLOWED. >:(");

          // Force the draggable to revert. Idea from:
          // https://stackoverflow.com/questions/6071409/draggable-revert-if-outside-this-div-and-inside-of-other-draggables-using-both
          ui.draggable.draggable('option', 'revert', true);
          return;
        }

      }

      if (gameboard_length >= 2) {
        // Now there should only be up and down placement.
        console.log("Only up and down should be allowed.");

        /*
            X+X
            X*X
            X*X
            X+X

            * = the first / second tiles
            + = valid space
            X = NOT VALID SPACE

            Assuming (7,7) & (8,7) are already placed, then two valid places are
            (6,7) & (9,7)

        */
        if (left_right == true) {
          // First col - 1 and last col + 1 are valid, with same row.
          var valid_left = find_table_position(game_board[0].id);
          var valid_right = find_table_position(game_board[gameboard_length - 1].id);
          var cur_pos = find_table_position(droppableID);

          // Add or subtract for the valid position.
          valid_left[1] = parseInt(valid_left[1]) - 1;
          valid_right[1] = parseInt(valid_right[1]) + 1;

          // Debugging
          console.log("Valid left pos = " + valid_left + " Valid right position: " + valid_right + " Proposed position: " + cur_pos);

          var test = cur_pos.toString();

          // See if this is a valid move!
          if ( test == valid_left.toString() || test == valid_right.toString() ) {
            if( test == valid_left.toString() ) {
              insert_beg = true;
            }

            // Yes! It is allowed!
            console.log("Allowed. L/R. Game board length = " + gameboard_length);
          }
          else {
            // Not allowed.
            console.log("NOT Allowed. L/R. Game board length = " + gameboard_length);

            // Force the draggable to revert. Idea from:
            // https://stackoverflow.com/questions/6071409/draggable-revert-if-outside-this-div-and-inside-of-other-draggables-using-both
            ui.draggable.draggable('option', 'revert', true);
            return;
          }
        }
        else {
          // First row - 1 and last row + 1 are valid, with same col.
          var valid_top = find_table_position(game_board[0].id);
          var valid_bottom = find_table_position(game_board[gameboard_length - 1].id);
          var cur_pos = find_table_position(droppableID);

          // Add or subtract for the valid position.
          valid_top[0] = parseInt(valid_top[0]) - 1;
          valid_bottom[0] = parseInt(valid_bottom[0]) + 1;

          // Debugging
          console.log("Valid top pos = " + valid_top + " Valid bottom position: " + valid_bottom + " Proposed position: " + cur_pos);

          var test = cur_pos.toString();

          // See if this is a valid move!
          if ( test == valid_top.toString() || test == valid_bottom.toString() ) {
            if (test == valid_top.toString()) {
              insert_beg = true;
            }

            // Yes! It is allowed!
            console.log("Allowed. T/B. Game board length = " + gameboard_length);
          }
          else {
            // Not allowed.
            console.log("NOT Allowed. T/B. Game board length = " + gameboard_length);

            // Force the draggable to revert. Idea from:
            // https://stackoverflow.com/questions/6071409/draggable-revert-if-outside-this-div-and-inside-of-other-draggables-using-both
            ui.draggable.draggable('option', 'revert', true);
            return;
          }
        }
      }

      //**********************************
      //* IF WE GET HERE, this is valid. *
      //**********************************

      // Add the current items to the game board array.
      // Style should be like: {"id": "drop0",  "tile": "pieceX"},
      var obj = {};
      obj['id'] = droppableID;          // This style works as an object.
      obj['tile'] = draggableID;

      // If it's a duplicate, just move it.
      if (duplicate == true) {
        if (insert_beg == false) {
          // remove then add it back at the end.
          game_board.splice(dup_index, 1);
          game_board.push(obj);
        }
        else{
          // remove then add it back at the beginning.
          game_board.splice(dup_index, 1);
          game_board.unshift(obj);
        }
      }

      // Don't add duplicates to the array again!
      if (duplicate == false) {
        if (insert_beg == false) {
          // Push back to the game board array.
          game_board.push(obj);
        }
        else {
          // Push to the front of the game board array.
          game_board.unshift(obj);    // URL for info: https://stackoverflow.com/questions/8159524/javascript-pushing-element-at-the-beginning-of-an-array
        }

      }

      // Recalculate this.
      gameboard_length = game_board.length;


      // This makes it so only the given tile may be dropped on the current spot.
      // See this Stackoverflow post for more info: https://stackoverflow.com/questions/3948447/jquery-ui-droppable-only-accept-one-draggable
      //$(this).droppable('option', 'accept', ui.draggable);
      $(this).droppable('disable');

      // This from Stackoverflow, it snaps to where it was dropped.
      // URL: https://stackoverflow.com/questions/30122234/how-to-make-an-accept-condition-for-droppable-td-to-accept-only-the-class-within
      $(this).append($(ui.draggable));
      ui.draggable.css("top", $(this).css("top"));
      ui.draggable.css("left", $(this).css("left"));
      ui.draggable.css("position", "relative");

      // Update the word as it stands now.
      find_word();
    },
    out: function(event, ui) {
      // Not even sure if we need this but let's see first.
    },
    zIndex: -1
  });
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