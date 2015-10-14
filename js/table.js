/*
    File: ~/js/table.js
    91.461 Assignment 6: Creating an Interactive Dynamic Table
    Jason Downing - student at UMass Lowell in 91.461 GUI Programming I
    Contact: jdowning@cs.uml.edu or jason_downing@student.uml.edu
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Oct 13, 2015.
    Last Updated: Oct 13, 9PM.

    This page is for the 6th assignment, "Creating an Interactive Dynamic Table".
    It contains a JavaScript function called table_calc() which calculates out
    the multiplication table, and then calls a function called table_fill() which
    fills in the table.
*/

// This function calculates the multiplication table.
function table_calc() {
  // Calculate the multiplication table.
  // We'll do a 2d array, of:
  /*
      x 1  2  3  4  5
      5 5 10 15 20 25
      6 6 12 18 24 30
      etc
  */

  // Found how to do this on Stackoverflow
  // URL: https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
  var calc = new Array(5);    // Ending length

  for (var x = 0; x < 4; x++) {   // x < Ending length
    calc = new Array(5);
  }

  // Make the top left corner 0, and ignore it in the future.
  calc[0][0] = 0;

  var hor = 1;    // start at 1 to ignore the "x". Reset to 0 each loop though.
  var vert = 0;   // increment by 1 each pass through columns.

  // Now let's calculate the multiplication table
  //         hor beg  hor ending
  for (var x = 5; x <= 8; x++) {
    //       vert beg  vert ending
    for (var y = 1; y <= 5; y++) {
      calc[hor][vert] = x * y;    // Calculate the given spot in the multiplication table.
      hor++;                      // Horizontal counter increments each time.
    }
    hor = 0;
    vert++;
  }

  table_fill();
}

// This function fills in the multiplication table.
function table_fill() {
  console.log("The array looks like:\n", calc);
}