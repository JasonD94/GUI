/*
    File: ~/js/table_v2.js
    91.461 Assignment 7: Using the jQuery Validation Plugin with Your Dynamic Table
    Jason Downing - student at UMass Lowell in 91.461 GUI Programming I
    Contact: jdowning@cs.uml.edu or jason_downing@student.uml.edu
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Nov 1, 2015.
    Last Updated: Nov 1, 9PM.

    This page is for the 7th assignment. It is a complete copy of my assignment 6
    JavaScript code, except this one uses the jQuery Validation plugin.

    It contains a JavaScript function called table_calc() which calculates out
    the multiplication table, and then calls a function called table_fill() which
    fills in the table.
*/

function validate() {

  // Switch to using the jQuery Validation Plugin
  // See this demo: jqueryvalidation.org/files/demo/
  // And Prof. Heines' website: https://teaching.cs.uml.edu/~heines/91.461/91.461-2015-16f/461-lecs/lecture18.jsp
  $("#mult_form").validate({
    // Rules for validating the form.
    rules: {
      horiz_start: {
        number: true,
        range:[-10, 10],
        required: true
      },
      horiz_end: {
        number: true,
        range:[-10, 10],
        required: true
      },
      vert_start: {
        number: true,
        range:[-10, 10],
        required: true
      },
      vert_end: {
        number: true,
        range:[-10, 10],
        required: true
      }
    },

    // Messages that appear if a rule isn't valid.
    messages: {
      horiz_start: {
        number: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Horizontal start.</p>");

        },
        range: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Horizontal start.</p>");
        },
        required: function() {
          $("#error_msg").append("<p>A number between -10 and 10 is required for the Horizontal start.</p>");

        }
      },
      horiz_end: {
        number: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Horizontal end.</p>");

        },
        range: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Horizontal end.</p>");
        },
        required: function() {
          $("#error_msg").append("<p>A number between -10 and 10 is required for the Horizontal end.</p>");

        }
      },
      vert_start: {
        number: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Vertical start.</p>");

        },
        range: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Vertical start.</p>");
        },
        required: function() {
          $("#error_msg").append("<p>A number between -10 and 10 is required for the Vertical start.</p>");

        }
      },
      vert_end: {
        number: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Vertical end.</p>");

        },
        range: function() {
          $("#error_msg").append("<p>Please enter a number between -10 and 10 for the Vertical end.</p>");
        },
        required: function() {
          $("#error_msg").append("<p>A number between -10 and 10 is required for the Vertical end.</p>");

        }
      }
    },

    // When the form is
    submitHandler: function() {
      // Call the calculate function.
      table_calc();
    },

    // This is from stackoverflow, its helpful to stop the validator plugin from moving the inputs around
    // with the error message. I already had a div for error messages anyway, so why not use that?
    // URL: https://stackoverflow.com/questions/3691743/jquery-validate-how-to-keep-error-messages-from-altering-the-form-disposition
    errorElement: "div",
    errorPlacement: function(error, element) {
      $("#error").html(error);
    }
  });
}

// This function calculates the multiplication table.
function table_calc() {
  /*  User input - from the form on the assignment 6 HTML doc.
      Convert to a number using type casting. This fixed so many random bugs
      in my code. W3Schools helped a ton in figuring this out, as comparisons
      would fail randomly before I added this.
      http://www.w3schools.com/js/js_comparisons.asp
  */
  var hor_start = Number(document.getElementById('horiz_start').value);
  var hor_end = Number(document.getElementById('horiz_end').value);
  var vert_start = Number(document.getElementById('vert_start').value);
  var vert_end = Number(document.getElementById('vert_end').value);

  // Check to see if the numbers are read correctly.
  console.log("Horizontal start: ", hor_start, "Horizontal end: ", hor_end),
  console.log("Vertical start: ", vert_start, "Vertical end: ", vert_end);

  // Empty the div first.
  // See this Stackoverflow post: https://stackoverflow.com/questions/20293680/how-to-empty-div-before-append
  $("#error_msg").empty();

  // Swap beginning / ending numbers if the start is larger than the beginning.
  if (hor_start > hor_end) {

    // Alert the user that this is happening!
    $("#error_msg").append("<p>Swapping the Horizontal start and Horizontal end.</p>");

    var tmp_num = hor_start;
    hor_start = hor_end;
    hor_end = tmp_num;
  }
  // Also swap vertical beginning / ending
  if (vert_start > vert_end) {

    // Alert the user that this is happening!
    $("#error_msg").append("<p>Swapping the Vertical start and Vertical end.</p>");

    var tmp_num = vert_start;
    vert_start = vert_end;
    vert_end = tmp_num;
  }

  /*  Instead of an array of arrays, use an object containing each rows array.
      Example:
      matrix {
        row1: [1, 2, 3,  4,  5],
        row2: [3, 6, 9, 12, 15],
        row3: [etc],
        row4: [etc]
      }
  */
  var matrix = {};

  // Flip the inputs around if the end is less than the start.
  // This would break the <= row code below.
  // Also use absolute values - so if we got say -8 it would ignore the negative.
  var rows = Math.abs(hor_end - hor_start);
  var columns = Math.abs(vert_end - vert_start);

  // Indexes for the 2D array.
  var horz = hor_start;
  var vert = vert_start;

  /*  Calculate the multiplication table using an object (matrix) and a bunch
      of arrays. I use a temp. array, calculate out a whole row's values, and
      then save that row's array in the object. See the example where var matrix
      is declared for an example.    */
  for (var x = 0; x <= columns; x++) {
    var tmp_arr = [];

    for (var y = 0; y <= rows; y++) {
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
function table_fill(matrix) {
  // Debugging.
  console.log("The array looks like:\n", matrix);

  // User input
  // Convert to number to prevent random shit
  // http://www.w3schools.com/js/js_comparisons.asp
  var hor_start = Number(document.getElementById('horiz_start').value);
  var hor_end = Number(document.getElementById('horiz_end').value);
  var vert_start = Number(document.getElementById('vert_start').value);
  var vert_end = Number(document.getElementById('vert_end').value);

  // Check to see if the numbers are read correctly.
  console.log("Horizontal start: ", hor_start, "Horizontal end: ", hor_end,
              "---Vertical start: ", vert_start, "Vertical end: ", vert_end);

  // Swap beginning / ending numbers if the start is larger than the beginning.
  if (hor_start > hor_end) {
    var tmp_num = hor_start;
    hor_start = hor_end;
    hor_end = tmp_num;
  }
  // Also swap vertical beginning / ending
  if (vert_start > vert_end) {
    var tmp_num = vert_start;
    vert_start = vert_end;
    vert_end = tmp_num;
  }

  // Flip the inputs around if the end is less than the start. This would break <= row code below.
  // Do using this absolute values - so if we got say -8 it would ignore the negative.
  var rows = Math.abs(hor_end - hor_start);
  var columns = Math.abs(vert_end - vert_start);

  // Now we can fill in the table.
  // w3schools is helpful: http://www.w3schools.com/html/html_tables.asp
  var content = "";

  // Opening table tags.
  content += "<table>";

  // First row, and put an empty spot in the top left corner.
  content += "<tr><td></td>";

  // Now fill out the rest of the first row.
  for (var a = hor_start; a <= hor_end; a++) {
    content += "<td>" + a + "</td>";
  }

  // Close the first row.
  content += "</tr>";

  // Print out the left most column using this variable.
  var vert = vert_start;

  // Fill in each row after the first.
  for (var x = 0; x <= columns; x++) {
    // Set the left most column first.
    content += "<tr><td>" + vert + "</td>";

    // Add in all the multiplication for this row.
    for (var y = 0; y <= rows; y++) {
      content += "<td>" + matrix["row" + x][y] + "</td>";
    }
    vert++;

    // Close each row.
    content += "</tr>";
  }

  // Ending table tags.
  content += "</table>";

  // Now the content gets loaded into the HTML page.
  $("#multiplication_table").html(content);

  // Stop the form from refreshing.
  return false;
}
