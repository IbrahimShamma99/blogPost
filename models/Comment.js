var mongoose = require('mongoose');
/**
 * @Body => body of the comment
 * @author => author of the article
 * @article =>article you commented on
 * @UpvotesCount =>number of upvotes on the comments
 * @timestamps => to save the datetime of the operation 
 */
var CommentSchema = new mongoose.Schema({
    body: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    UpvotesCount: { type: Number, default: 0 }
}, {
    timestamps: true
});

// Requires population of author
CommentSchema.methods.toJSONFor = function(user) {
    return {
        id: this._id,
        body: this.body,
        createdAt: this.createdAt,
        author: this.author.toProfileJSONFor(user)
    };
};
CommentSchema.methods.updateUpvotesCount = function() {
    var comment = this;

    return User.count({ Upvotes: { $in: [comment._id] } }).then(function(count) {
        comment.updateUpvotesCount = count;

        return comment.save();
    });
};

mongoose.model('Comment', CommentSchema);