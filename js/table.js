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

var song_lyrics;
var content = "";

// Get the JSON file into a global var called song_lyrics
function get_json() {
  jQuery.get("json/lyrics.json", function(data) {
    song_lyrics = data;   // Save lyrics JSON file into song_lyrics variable.
    place_json();         // Place JSON data into the HTML document
  });
}

// Place the JSON data into the HTML document.
function place_json() {
  // Creating content dynamically using the JSON data.
  content += "<h1 class='title'>" + song_lyrics.title + "</h1>";
  content += "<h2 class='artist'>" + song_lyrics.artist + "</h2>";

  content += "<br/>";   // Add newline.

  // Start looping through the lyrics.
  // Lyrics are from: http://www.ratm.net/lyrics/sle.html
  content += "<p class='YEAAH'>" + song_lyrics.lyrics.yeah + "</p>";
  content += "<br/>";   // Add newline.

  // First paragraph
  for(var key in song_lyrics.lyrics.first) {
    if(song_lyrics.lyrics.first.hasOwnProperty(key)) {
      var value = song_lyrics.lyrics.first[key];
      content += "<p class='first'>" + value + "</p>";
    }
  }
  content += "<br/>";   // Add newline.

  // Print out two "Hey! Hey!" lines
  print_hey(content);

  // Second paragraph
  for(var key in song_lyrics.lyrics.second) {
    if(song_lyrics.lyrics.second.hasOwnProperty(key)) {
      var value = song_lyrics.lyrics.second[key];
      content += "<p class='second'>" + value + "</p>";
    }
  }
  content += "<br/>";   // Add newline.

  // Two more "Hey! Hey!" lines
  print_hey(content);

  // Third paragraph
  for(var key in song_lyrics.lyrics.third) {
    if(song_lyrics.lyrics.third.hasOwnProperty(key)) {
      var value = song_lyrics.lyrics.third[key];
      content += "<p class='third'>" + value + "</p>";
    }
  }
  content += "<br/>";   // Add newline.

  // YEAAAAH!
  content += "<p class='YEAAH'>" + song_lyrics.lyrics.yeah + "</p>";
  content += "<br/>";   // Add newline.

  // "SLEEP NOW IN THE FIRE!" lines.
  for(var key in song_lyrics.lyrics.sleep) {
    if(song_lyrics.lyrics.third.hasOwnProperty(key)) {
      var value = song_lyrics.lyrics.sleep[key];
      content += "<p class='sleep'>" + value + "</p>";
    }
  }

  // Now the content gets loaded into the HTML page.
  $("#place_json_here").html(content);
}

// Instead of repeating two for loops, use just one.
function print_hey() {
  for(var x = 0; x < 2; x++) {
    for(var key in song_lyrics.lyrics.hey) {
      if(song_lyrics.lyrics.hey.hasOwnProperty(key)) {
        var value = song_lyrics.lyrics.hey[key];
        if(value == "HEY!") { // "HEY!" should be blue.
          content += "<p class='hey'>" + value + "</p>";
        }
        else {  // The "SLEEP NOW IN THE FIRE" part will be red.
          content += "<p class='sleep'>" + value + "</p>";
        }
      }
    }
    content += "<br/>";   // Add newline.
  }
}