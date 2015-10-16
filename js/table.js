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

  // Validate user input
  if (hor_start == hor_end || vert_start == vert_end) {
    alert("Sorry, please enter a wider number range (at least 1 number apart).");
    return;   
  }
  
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

  var calc = [];

  /*
    2D Array for calculating the multiplication table.

    I found how to do this on Stackoverflow
    https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
  */
  
  console.log("ARRAY IS: ", calc);

  // Indexes for the 2D array.
  var hor = 0;
  var vert = 0;

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
  for (var x = vert_start; x <= vert_end; x++) {
    var tmp_arr = [];
    for (var y = hor_start; y <= hor_end; y++) {
      // Calculate the given spot in the multiplication table.
      console.log("ARRAY IS: ", calc);
      tmp_arr[hor] = x * y;
      hor++;
    }
    calc[vert] = tmp_arr;
    hor = 0;        // Reset to zero each pass since we're moving down a row.
    vert++;
  }

  table_fill(calc);
  return false;
}

// This function fills in the multiplication table.
function table_fill(calc_array) {
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

  var hor = 0;          // Indexes for the 2D array.
  var vert = 0;

  // Fill in each row after the first.
  for (var x = vert_start; x <= vert_end; x++) {
    // Set the left most column first.
    content += "<tr><td>" + x + "</td>";
    
    var tmp_arr = calc_array[hor];

    // Add in all the multiplication for this row.
    for (var y = hor_start; y <= hor_end; y++) {
      content += "<td>" + tmp_arr[vert] + "</td>";
      vert++;
    }
    // Reset horizontal counter each time as we move down a row.
    vert = 0;
    hor++;

    // Close each row.
    content += "</tr>";
  }

  // Ending table tags.
  content += "</table>";

  // Now the content gets loaded into the HTML page.
  $("#multiplication_table").html(content);
}
