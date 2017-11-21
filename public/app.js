// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});
// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the comments from the comment section
  $("#comments").empty();
  // how do we know a p tag exists?
  // Save the id from the p tag
  // recall: objectId or ObjectId in one of the models files, i think
  var thisId = $(this).attr("data-id");
  // make an ajax call for the Article
  // ? i wonder if there is a parallel between /articles here and /articles
  // in server.js
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // after that is done? add the comment information to the page
    .done(function(data) {
      console.log(data);
      // article's title
      $("#comments").append(
        "<h1>Article you selected:</h1><h2>" + data.title + "</h2>");
      // comment's title
      $("#comments").append("<input id='title-input' name='title' placeholder='My title'>");
      // comment's body
      $("#comments").append("<textarea id='body-input' name='body' placeholder='My comment'></textarea>");
      // A button to submit a new comment, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='save-comment'>Save Comment</button>");
      // If there's a comment in the article
      if (data.comment) {
        // Place the title of the comment in the title input
        $("#title-input").val(data.comment.title);
        // Place the body of the comment in the body textarea
        $("#body-input").val(data.comment.body);
      }
    });
});
// When you click the savenote button
$(document).on("click", "#save-comment", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#title-input").val(),
      // Value taken from comment textarea
      body: $("#body-input").val()
    }
  })
    // ? after that is done?
    .done(function(data) {
      // ? data is the response?
      console.log(data);
      $("#comments").empty();
      $('#comment-saved').append('<h2>Your comment has been saved!</h2>');
    });
  // Also, remove the values entered in the input and textarea 
  // for comment entry
  $("#title-input").val("");
  $("#body-input").val("");
});