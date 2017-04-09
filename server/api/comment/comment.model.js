const mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    content : String,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    isDeleted : {
        type: Boolean,
        default: false
    }
}, {
    timestamps : true
});

module.exports = mongoose.model('Comment', commentSchema);