/*
    File: ~/js/scrabble/score.js
    91.461 Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
    Jason Downing - student at UMass Lowell in 91.461 GUI Programming I
    Contact: jdowning@cs.uml.edu or jason_downing@student.uml.edu
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Nov 24, 2015.
    Last Updated: Dec 8, 1PM.

    This JavaScript file is for the 9th assignment, "Scrabble".

    This file contains all of the scoring logic for the Scrabble board game.

    TODO:
        - Fix multiple words special spaces scoring
            (when 2+ words are played, double/triple word spaces shouldn't
             double the ENTIRE score, just the CURRENT WORD.)
*/


/**
 *    When called, this function determine what the current word is.
 *    It also determines what the score is for the word that it finds.
 *    Both the word and score are printed to HTML.
 *
 */
function find_word(read_left) {
  var word = "";                              // The current word.
  var score = word_score;                     // This DEFAULTS TO ZERO, but afterwards defaults to whatever the total score is!
  var board_length = game_board.length;       // Current game board
  var word_count = complete_words.length;     // All saved words

  // The word is now blank.
  $("#word").html("____");
  $("#score").html(score);

  // Go through the game board and generate a possible word.
  for(var i = 0; i < board_length; i++) {
    word += find_letter(game_board[i].tile);
    score += find_score(game_board[i].tile);
  }

  //   TODO:  FIX DOUBLE / TRIPLE WORD LOGIC FOR MULTIPLE WORDS.
  //          CURRENTLY IT DOUBLES / TRIPLES THE ENTIRE SCORE WHICH IS BAD.

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


/**
 *    This function determines whether to double or triple the word score.
 *    Returns:
 *    0 = neither
 *    1 = double
 *    2 = triple
 *
 */
function should_double_triple_word() {
  // Get board array length. This will be useful for our checks next.
  var gameboard_length = game_board.length;

  // Go through the game board and see if any spots have the
  // class "double_word" or "triple_word"
  for (var i = 0; i < gameboard_length; i++) {
    var space_ID = "#" + game_board[i].id

    if ( $(space_ID).hasClass('double_word') == true ) {
      // Sweet! Double the word's value!
      return 1;
    }
    else if ( $(space_ID).hasClass('triple_word') == true ) {
      // SWEET! IT'S A TRIPLE!
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


/**
 *    Given a tile ID, figures out which dropID this is and whether to double the
 *    letter score or not.
 *    Returns:
 *    0 = neither
 *    1 = double
 *    2 = triple
 */
function should_double_triple_letter(given_id) {
  var space;

  for(var i = 0; i < game_board.length; i++) {
    if(game_board[i].tile == given_id){
      space = "#" + game_board[i].id;
    }
  }

  /*
      Using "hasClass" to detect if this is a double / triple space.
  */

  if ( $(space).hasClass("double_letter") == true ) {
    // Sweet! Double the letter's value!
    return 1;
  }
  else if ( $(space).hasClass("triple_letter") == true ) {
    // SWEET! IT'S A TRIPLE!
    return 2;
  }

  // Otherwise return 1.
  return 0;
}

