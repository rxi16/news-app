var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
// var exphbs = require('express-handlebars');
// var request = require('request');
var mongoose = require('mongoose');
// scraping tools
// axios is a promised-based http library
// axios is similar to jQuery's ajax method
// axios works on the client and server sides
var axios = require('axios');
var cheerio = require('cheerio');
// var models = require('./models');
var db = require('./models');
var app = express();
// configure middleware
// use morgan logger to log requests
// ?use logger method?
app.use(logger('dev'));
// use bodyParser to process comment submissions
app.use(bodyParser.urlencoded({extended:false}));
// ? configure mongoose to leverage Javascript ECMAScript 6 Promises?
// ? ajax call in app.js, or no ajax call?
// use static method
app.use(express.static('public'));
// ? use mongoose to leverage Javascript ECMAScript 6 Promises
mongoose.Promise = Promise;
// connect to Mongo DB
// previously created a database on mlab
/*mongoose.connect('https://mlab.com/databases/articlespluscomments', {
  useMongoClient:true
});*/
mongoose.connect('mongodb://localhost/articlesandcomments', {
  useMongoClient:true
});
// scrape the echojs website
app.get('/scrape', function(req, res) {
  // ? request body of html?
  // ? are we talking about a static file, here?
  axios.get('http://www.echojs.com')
    // ? see what happens if i replace res with body
    .then(function(response) {
      // ? load html body into cheerio?
      // seems like 'data' represents html body
      var $ = cheerio.load(response.data);
      // ? article tag?
      // ? h2 tags are nested within article tags?
      $('article h2').each(function(i, element) {
        // ? make this an array rather than object?
        var result = {};
        // ?'this' is the response?
        result.title = $(this).children('a').text();
        result.link = $(this).children('a').attr('href');
        // create a new Article instance using this new object
        db.Article.create(result)
          // ? call this newArticle instead?
          .then(function(dbArticle) {
            // send message to client
            res.send('Successfully scraped and saved Article');
          }).catch(function(err) {
            // send error to client
            // ?catch method designed to catch errors?
            res.json(err);
          });
      });
    });
});
// get all Article instances from articlespluscomments db
// articles is name of collection
app.get('/articles', function(req, res) {
  // get every document in collection
  db.Article.find({}).then(function(dbArticle) {
    // send Article instances to client
    res.send(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});
// get an Article by id
// ? populate Article with associated comment?
app.get('/articles/:id', function(req, res) {
  // find matching id in our db, given request
  db.Article.findOne({'_id': req.params.id})
  // ?populate all the comments associated with this Article?
  .populate('comment').then(function(dbArticle) {
    // send Article instance to client
    res.send(dbArticle);
  }).catch(function(err) {
    res.json(err);
  });
});
// save/update an Article's comments
app.post('/articles/:id', function(req, res) {
  // ?create a new Comment instance?
  db.Comment.create(req.body).then(function(dbComment) {
    // ?find one Article with _id equal to req.params.id?
    // update Article instance with associated Comment instance
    // ?return updated User? do we have User instances? do we have a User model?
    // comments appears as a 5th field in robo 3t
    // {new:true} new means new User
    // ?mongoose query returns a promise?
    return db.Article.findOneAndUpdate(
      {'_id':req.params.id},{'comment':dbComment._id},{new:true}
    )
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
  });
});
app.listen(3000);