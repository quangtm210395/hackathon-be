const mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    title : String,
    imageUrl : String,
    content : String,
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    views : {
        type: Number,
        default: 0
    },
    plus : Number,
    isDeleted : {
        type: Boolean,
        default: false
    }
}, {
    timestamps : true
});

module.exports = mongoose.model('Post', postSchema);