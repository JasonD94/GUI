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

  // User input
  var hor_start = document.getElementById('horiz_start').value;
  var hor_end = document.getElementById('horiz_end').value;
  var vert_start = document.getElementById('vert_start').value;
  var vert_end = document.getElementById('vert_end').value;

  // Validate user input
  if (hor_start == hor_end || vert_start == vert_end) {
    return;   // Can't do this.
  }

  // Found how to do this on Stackoverflow
  // URL: https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
  var calc = [];

  for (var x = 0; x <= hor_end; x++) {   // x < Ending length
    calc[x] = [];
  }

  var hor = 0;          // Indexes for the 2D array.
  var vert = 0;

  // Now let's calculate the multiplication table using a 2D array.
  // I figured out how to do this using this stackoverflow post:
  // https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
  //         vert beg  vert ending
  for (var x = vert_start; x <= vert_end; x++) {
    //       hor beg  hor ending
    for (var y = hor_start; y <= hor_end; y++) {
      calc[hor][vert] = x * y;    // Calculate the given spot in the multiplication table.
      hor++;                      // Horizontal counter increments each time.
    }
    hor = 0;
    vert++;
  }

  table_fill(calc);
  return false;
}

// This function fills in the multiplication table.
function table_fill(calc_array) {
  console.log("The array looks like:\n", calc_array);

  // User input
  var hor_start = document.getElementById('horiz_start').value;
  var hor_end = document.getElementById('horiz_end').value;
  var vert_start = document.getElementById('vert_start').value;
  var vert_end = document.getElementById('vert_end').value;

  // Now we can fill in the table.
  // w3schools is helpful: http://www.w3schools.com/html/html_tables.asp
  var content = "";

  // Opening table tags.
  content += "<table class='dyn_table'>";

  // Start by putting the empty spot in the top left corner.
  content += "<tr class='dyn_tr_td'><td></td>";

  // Now fill out the rest of the first row.
  for (var x = hor_start; x <= hor_end; x++) {
    content += "<td class='dyn_tr_td'>" + x + "</td>";
  }

  // Close the first row.
  content += "</tr>";

  var hor = 0;          // Indexes for the 2D array.
  var vert = 0;

  // Fill in each row after the first.
  for (var x = vert_start; x <= vert_end; x++) {
    content += "<tr class='dyn_tr_td'> <td class='dyn_tr_td'>" + x + "</td>";

    for (var y = hor_start; y <= hor_end; y++) {
      content += "<td class='dyn_tr_td'>" + calc_array[hor][vert] + "</td>";
      hor++;
    }
    hor = 0;
    vert++;

    // Close each row.
    content += "</tr>";
  }

  // Ending table tags.
  content += "</table>";

  // Now the content gets loaded into the HTML page.
  $("#multiplication_table").html(content);
}