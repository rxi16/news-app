var mongoose = require("mongoose");
// Schema is a constructor?
var Schema = mongoose.Schema;
// create a new CommentSchema object
// This is similar to a Sequelize model
var CommentSchema = new Schema({
	// ? is title that of Article or that of comment?
	// we don't have a sub-property with name type?
	title: String,
	// we don't have a sub-property with name type?
	body: String
});
// use mongoose model method
// ?creates Comment model from above schema?
// pass string "Comment" and new instance of Schema object or Schema model?
var Comment = mongoose.model("Comment", CommentSchema);
// Export the Comment model
module.exports = Comment;