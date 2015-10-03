/*
    File: /~jason/js/json.js
    91.461 Assignment 5: do stuff with JSON
    Jason Downing - student at UMass Lowell in 91.461 GUI Programming I
    Contact: jdowning@cs.uml.edu or jason_downing@student.uml.edu
    MIT Licensed - see http://opensource.org/licenses/MIT for details.
    Anyone may freely use this code. Just don't sue me if it breaks stuff.
    Created: Oct 3, 2015.
    Last Updated: Oct 3, 5PM.

    This JavaScript file will load a JSON file into a variable named song_lyrics,
    and then call another function called place_json which will then put the
    song lyrics into the HTML document. A CSS file will also format these elements,
    which can be found in the CSS/json.css file.
*/

var song_lyrics;

// Get the JSON file into a global var called song_lyrics
function get_json() {
  jQuery.get("~/json/lyrics.json", function(data) {
    song_lyrics = data;   // Save lyrics JSON file into song_lyrics variable.
    place_json();         // Place JSON data into the HTML document
  });
}

// Place the JSON data into the HTML document.
function place_json() {
  var content = "";

  // Creating content dynamically using the JSON data.
  content += "<h1 class='title'>" + song_lyrics.title + "</h1>";
  content += "<h2 class='artist'>" + song_lyrics.artist + "</h2>";

  content += "<br/>";   // Add newline.

  // Start looping through the lyrics.
  // Lyrics are from: http://www.ratm.net/lyrics/sle.html
  content += "<p class='YEAAH'>" + song_lyrics.lyrics.yeah + "</p>";

  content += "<br/>";   // Add newline.

  // First paragraph
  for(var x = 0; x < song_lyrics.lyrics.first.length; x++) {
    content += "<p class='first'>" + song_lyrics.first[x] + "</p>";
  }

  content += "<br/>";   // Add newline.

  // Print out two "Hey! Hey!" lines
  for(var x = 0; x < 2; x++) {
    for(var y = 0; y < 3; y++) {
        content += "<p class='hey'>" + song_lyrics.hey[y] + "</p>";
    }
    content += "<br/>";   // Add newline.
  }

  // Second paragraph
  for(var x = 0; x < song_lyrics.lyrics.first.length; x++) {
    content += "<p class='second'>" + song_lyrics.second[x] + "</p>";
  }

  // Two more "Hey! Hey!" lines
  for(var x = 0; x < 2; x++) {
    for(var y = 0; y < 3; y++) {
        content += "<p class='hey'>" + song_lyrics.hey[y] + "</p>";
    }
    content += "<br/>";   // Add newline.
  }

  // Third paragraph
  for(var x = 0; x < song_lyrics.lyrics.first.length; x++) {
    content += "<p class='third'>" + song_lyrics.third[x] + "</p>";
  }

  // YEAAAAH!
  content += "<p class='YEAAH'>" + song_lyrics.lyrics.yeah + "</p>";

  // "SLEEP NOW IN THE FIRE!" lines.
  for(var x = 0; x < 5; x++) {
    content += "<p class='sleep'>" + song_lyrics.lyrics.sleep + "</p>";
  }

  // Now the content gets loaded into the HTML page.
  $("#place_json_here").html(content);
}