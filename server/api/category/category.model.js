const mongoose = require('mongoose');

var categorySchemna = new mongoose.Schema({
    name : String,
    description : String,
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    posts : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    isDeleted : {
        type: Boolean,
        default: false
    }
}, {
    timestamps : true
});

module.exports = mongoose.model('Category', categorySchemna);