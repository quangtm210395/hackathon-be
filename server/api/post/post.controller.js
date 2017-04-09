const fs = require('fs');
const async = require('async');
const config = require('../../configs');

var Post = require('./post.model');
var User = require('../user/user.model');
var Category = require('../category/category.model');
var Comment = require('../comment/comment.model');


module.exports = {
    getAll: (req, res) => {
        Post.find({
                isDeleted: false
            }).sort('name')
            .populate({
                path: 'author'
            })
            .populate({
                path: 'comments'
            })
            .populate({
                path: 'category'
            })
            .exec((err, posts) => {
                if (err) res.json({
                    status: false,
                    message: 'Not found!'
                });
                else {
                    posts.forEach((item) => {
                            item.plus = item.likes.length;
                        });
                    res.json({
                        status: true,
                        message: 'Found!',
                        result: posts
                    });
                }
            });
    },

    create: (req, res) => {
        if (req.body) {
            var newPost = new Post(req.body);
            newPost.created_by = req.user._id;
            var promise = newPost.save();
            promise.then((post) => {
                async.parallel({
                    one: (callback) => {
                        if (post.created_by) {
                            User.findById(post.created_by, (err, user) => {
                                if (err) {
                                    console.log(err);
                                    callback(err, 1);
                                } else {
                                    user.created.push(post._id);
                                    user.save((err, updatedUser) => {
                                        if (err) {
                                            console.log(err);
                                            callback(err, 1);
                                        } else
                                            callback(null, 1);
                                    });
                                }

                            });
                        } else callback(null, 1);
                    },
                    two: (callback) => {
                        if (post.category) {
                            Category.update({
                                    _id: post.category._id
                                }, {
                                    $addToSet: {
                                        posts: post._id
                                    }
                                })
                                .exec((err, updatedCategory) => {
                                    if (err) callback(err, 2);
                                    else callback(null, 2);
                                })
                        } else callback(null, 2);
                    }
                }, (err, results) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({
                            status: false,
                            message: err.message
                        });
                    } else {
                        console.log('Create successful!');
                        res.status(201).json({
                            status: true,
                            result: post
                        });
                    }
                });


            }, (err) => {
                console.log(err);
                res.status(400).json({
                    status: false,
                    message: "Cannot create!1"
                });
            });
        } else {
            res.status(400).json({
                status: false,
                message: "Cannot create!"
            });
        }
    },

    edit: (req, res) => {
        if (req.body && req.params.id) {
            Post.findByIdAndUpdate(req.params.id, {
                $set: {
                    title: updatePost.title,
                    imageUrl: updatePost.imageUrl,
                    content: updatePost.content,
                    category: updatePost.category
                }
            }, (err, updatedPost) => {
                if (err) {
                    throw err;
                    res.status(400).json({
                        status: false,
                        message: 'Update Failed!'
                    });
                } else
                    res.status(200).json({
                        status: true,
                        message: 'Update successful!'
                    });
            });
        } else {
            res.status(400).json({
                status: false,
                message: 'Update Failed!'
            });
        }
    },

    getPost: (req, res) => {
        if (req.params.id) {
            Post.findOne({
                    _id: req.params.id,
                    isDeleted: false
                })
                .populate({
                    path: 'author'
                })
                .populate({
                    path: 'category'
                })
                .populate({
                    path: 'comment'
                })
                .exec((err, post) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({
                            status: false,
                            message: "Not Found!"
                        });
                    } else {
                        Post.update({
                                _id: post._id
                            }, {$inc : {views : 1}})
                            .exec((err, foundPost) => {
                                if (err) res.json({
                                    status: false,
                                    message: 'Failed!'
                                });
                                else {
                                    post.plus = post.likes.length;
                                    post.views += 1;
                                    console.log(post);
                                    res.json({
                                        status: true,
                                        message: 'Found!',
                                        result: post
                                    });
                                }
                            });

                    }

                });
        } else {
            res.status(400).json({
                status: false,
                message: "Not Found!"
            });
        }

    },

    getPostsByIndex: (req, res) => {
        if (req.params) {
            var index = req.params.index ? req.params.index : 0;
            Post.find({
                    isDeleted: false
                })
                .sort('-updateAt')
                .limit(15)
                .skip(index * 15)
                .populate({
                    path: 'author'
                })
                .populate({
                    path: 'comments'
                })
                .populate({
                    path: 'category'
                })
                .exec((err, posts) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({
                            status: false,
                            message: "Not Found!"
                        });
                    } else {
                        posts.forEach((item) => {
                            item.plus = item.likes.length;
                        });
                        res.status(200).json({
                            status: true,
                            message: "Found!",
                            result: posts
                        });
                    }
                });
        } else {
            res.status(400).json({
                status: false,
                message: "Not Found!"
            });
        }
    },

    delete: (req, res) => {
        if (req.params.id) {
            Post.update({
                _id: req.params.id
            }, {
                $set: {
                    isDeleted: true
                }
            }).exec((err, updatedPost) => {
                if (err) res.json({
                    status: false,
                    message: 'Cannot delete!'
                });
                else {
                    async.parallel({
                        one: (callback) => {
                            User.update({
                                _id: updatedPost.author
                            }, {
                                $pop: {
                                    created: updatedPost._id
                                }
                            }).exec((err, updatedUser) => {
                                if (err) callback(err, 1);
                                else callback(null, 1);
                            });
                        },
                        two: (callback) => {
                            Category.update({
                                _id: updatedPost.category
                            }, {
                                $pop: {
                                    posts: updatedPost._id
                                }
                            }).exec((err, updatedCate) => {
                                if (err) callback(err, 2);
                                else callback(null, 2);
                            });
                        }
                    }, (err, results) => {
                        if (err) res.json({
                            status: false,
                            message: 'Cannot delete!'
                        });
                        else res.json({
                            status: true,
                            message: 'Delete successful!',
                            result: updatedPost
                        });
                    });

                }
            });
        }

    },

    like: (req, res) => {
        if (req.params.id) {
            Post.update({
                _id: req.params.id
            }, {
                $addToSet: {
                    likes: req.user._id
                }
            }).exec((err, updatedPost) => {
                if (err) res.json({
                    status: false,
                    message: 'Cannot like'
                });
                else res.json({
                    status: true,
                    message: 'Like successful!',
                    result: updatedPost
                })
            });
        } else {

        }
    },

    unlike: (req, res) => {
        if (req.params.id) {
            Post.update({
                _id: req.params.id
            }, {
                $pop: {
                    likes: req.user._id
                }
            }).exec((err, updatedPost) => {
                if (err) res.json({
                    status: false,
                    message: 'Cannot unlike'
                });
                else res.json({
                    status: true,
                    message: 'UnLike successful!',
                    result: updatedPost
                })
            });
        } else {

        }
    },

    sida: (req, res) => {
        fs.readFile(__dirname + '/../../posts.json', (err, data) => {
            if (err) throw err;
            else {
                let dataJSON = JSON.parse(data);
                dataJSON["posts"].forEach((item, i) => {
                    var post = new Post(item);
                    post.save().then(
                        (doc) => {
                            console.log(doc);
                            res.status(200).json({
                                status: true,
                                message: 'Insert successful!'
                            });
                        }, (err) => {
                            console.log(err);
                            res.status(400).json({
                                status: false,
                                message: 'Insert Failed!'
                            });
                        }
                    );
                });
            }
        });
    }
}