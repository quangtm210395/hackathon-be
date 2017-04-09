const fs = require('fs');
const async = require('async');
const config = require('../../configs');

var Post = require('../post/post.model');
var User = require('../user/user.model');
var Comment = require('./comment.model');

module.exports = {
    getAll: (req, res) => {
        Comment.find({isDeleted : false})
            .populate({
                path: 'created_by'
            })
            .populate({
                path: 'posts'
            })
            .exec((err, data) => {
                if (err) res.json({
                    status: false,
                    message: 'Not found!'
                });
                else res.json({
                    status: true,
                    message: 'Found!',
                    result: data
                });
            });
    },

    create : (req, res) => {
        if(req.params.id && req.body) {
            var newComment = new Comment(req.body);
            newComment.post = req.params.id;
            newComment.save((err, comment) => {
                if (err) res.json({status:false, message: 'Cannot comment!'});
                else {
                    Post.update({
                        _id: req.params.id
                    }, {
                        $addToSet: {
                            comments: comment._id
                        }
                    }).exec((err, updatedPost) => {
                        if (err) res.json({
                            status: false,
                            message: 'Cannot comment'
                        });
                        else res.json({
                            status: true,
                            message: 'Comment successful!',
                            result: comment
                        })
                    });
                }
            });
        } else {
            res.json({
                status: false,
                message: 'Cannot comment'
            });
        }
    },

    edit : (req, res) => {
        if(req.params.id && req.body) {
            Comment.update({_id : req.params.id}, {content: req.body.content})
                .exec((err, updatedComment) => {
                    if (err) res.json({status: false, message: 'Edit failed!'});
                    else {
                        res.json({status: true, message: 'Edit successful!', result : updatedComment});
                    }
                });
        }
    },

    delete : (req, res) => {
        if (req.params.id ) {
            Comment.findOneAndUpdate({_id: req.params.id} , {$set : {isDeleted : true}}, {new : true})
                .exec((err, updatedComment) => {
                    if (err) res.json({status: false, message: 'Cannot delete!' });
                    else {
                        console.log(updatedComment._id);
                        Post.update({_id: updatedComment.post} , {$pull : {comments : updatedComment._id}})
                            .exec((err, updatedPost) => {
                                if (err) res.json ({status: false, message: 'Cannot delete comment'});
                                else res.json({status: true, message: 'Delete successful!', result: updatedComment});
                            });
                    }
                });
        } else {
            res.json({status: false, message: 'Cannot delete!'})
        }
    }
}