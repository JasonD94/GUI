/*
    File: ~/js/table.js
    91.461 Assignment 6: Creating an Interactive Dynamic Table
    Jason Downing - student at UMass Lowell in 91.461 GUI Programming I
    Contact: jdowning@cs.uml.edu or jason_downing@student.uml.edu
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Oct 13, 2015.
    Last Updated: Oct 15th, 3:30PM

    This page is for the 6th assignment, "Creating an Interactive Dynamic Table".
    It contains a JavaScript function called table_calc() which calculates out
    the multiplication table, and then calls a function called table_fill() which
    fills in the table.
*/

// This function calculates the multiplication table.
function table_calc() {
  // User input
  var hor_start = document.getElementById('horiz_start').value;
  var hor_end = document.getElementById('horiz_end').value;
  var vert_start = document.getElementById('vert_start').value;
  var vert_end = document.getElementById('vert_end').value;

  // It crashes on huge numbers so don't let users enter numbers greater/less than 1,000
  if (hor_start < -1000 || hor_end > 1000 || vert_start < -1000 || vert_end > 1000) {
    alert("Sorry, but valid input is a number between -1000 and 1000.");
    return;
  }

  // Flip the inputs around if the end is less than the start.
  // This would break the row count code.
  if (hor_end < hor_start) {
    var tmp = hor_end;
    hor_end = hor_start;    // Swap two ints.
    hor_start = tmp;
  }

  // Also flip around vertical indexes too if the end is less than the start.
  if (vert_end < vert_start) {
    var tmp = vert_end;
    vert_end = vert_start;
    vert_start = tmp;
  }

  /*

    this code is badly broken.
    and i don't know why.
    2d arrays are annoying in JavaScript.

    thought:

    instead of array of arrays, use an object containing each rows array.

    EG:

    matrix {
      row1: [1, 2, 3,  4,  5],
      row2: [3, 6, 9, 12, 15],
      row3: [etc],
      row4: [etc]
    }

  */

  var matrix = {};                          // empty object
  var rows = hor_end - hor_start;         // Need to know how many rows / columns
  var columns = vert_end - vert_start;

  // Debugging
  console.log("Object is: ", matrix);

  // Indexes for the 2D array.
  var horz = hor_start;
  var vert = vert_start;

  /*  Now let's calculate the multiplication table using a 2D array.
      This parts confusing so let me explain:
      I start at the first vertical position, and then calculate out that
      entire row. I do a similar for loop in the table_fill to access each
      row one at a time so that the table's <tr> tags have an entire row of
      multiplication data.
      I used indexes that start at 0 since the 2D array starts at 0 as well.
      The two for loops can then be used for multiplying numbers.
      The vert position index increases each time as we move down a row.
      The horizontal index resets to zero each time since we're doing a
  */
  for (var x = 0; x <= rows; x++) {
    var tmp_arr = [];

    for (var y = 0; y <= columns; y++) {
      // Calculate the given spot in the multiplication table.
      var calc = horz * vert;
      tmp_arr[y] = calc;
      horz++;
    }

    // Save the current row in the object.
    matrix["row" + x] = tmp_arr;

    horz = hor_start;        // Reset each pass since we're moving down a row.
    vert++;
  }

  table_fill(matrix);
  return false;
}

// This function fills in the multiplication table.
function table_fill(mult_matrix) {
  // Debugging.
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
  content += "<table>";

  // First row, and put an empty spot in the top left corner.
  content += "<tr><td></td>";

  // Now fill out the rest of the first row.
  for (var x = hor_start; x <= hor_end; x++) {
    content += "<td>" + x + "</td>";
  }

  // Close the first row.
  content += "</tr>";

  // Figure out how many rows and columns we have.
  var rows = hor_end - hor_start;
  var columns = vert_end - vert_start;

  // Print out the left most column using this variable.
  var vert = vert_start;

  // Fill in each row after the first.
  for (var x = 0; x <= rows; x++) {
    // Set the left most column first.
    content += "<tr><td>" + vert + "</td>";

    // Add in all the multiplication for this row.
    for (var y = 0; y <= columns; y++) {
      content += "<td>" + calc_array[y][x] + "</td>";
    }
    vert++;

    // Close each row.
    content += "</tr>";
  }

  // Ending table tags.
  content += "</table>";

  // Now the content gets loaded into the HTML page.
  $("#multiplication_table").html(content);
}
