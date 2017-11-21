var mongoose = require("mongoose");
// mongoose.Schema is a Schema constructor?
var Schema = mongoose.Schema;
// create a new ArticleSchema object, using the Schema constructor
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required
  title: {
    type: String,
    required: true
  },
  // `link` is required
  link: {
    type: String,
    required: true
  },
  // `comment` is an object that stores a Comment id
  // where is the Comment id produced??
  // camel case
  // populate the Article with an associated Comment
  // ref property links the ObjectId to the Comment model
  // "Comment" or "comment" passed to a function somewhere
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});
// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);
// Export the Article model
module.exports = Article;