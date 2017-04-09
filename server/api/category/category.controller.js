const fs = require('fs');
const async = require('async');
const config = require('../../configs');

var Post = require('../post/post.model');
var User = require('../user/user.model');
var Category = require('./category.model');

module.exports = {
    getAll: (req, res) => {
        Category.find().sort('name')
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

    create: (req, res) => {
        if (req.body) {
            var newCategory = new Category(req.body);
            newCategory.created_by = req.user._id;
            newCategory.save((err, category) => {
                if (err) res.json({
                    status: false,
                    message: 'Cannot create!'
                });
                else {
                    if (category.created_by) {
                        User.update({
                                _id: category.created_by
                            }, {
                                $addToSet: {
                                    created_category: category.created_by
                                }
                            })
                            .exec((err, user) => {
                                if (err) res.json({
                                    status: false,
                                    message: 'Cannot create!'
                                });
                                else res.json({
                                    status: true,
                                    message: 'create successful!',
                                    result: category
                                });
                            });
                    }
                }
            });
        } else {

        }
    },

    sida: (req, res) => {
        fs.readFile(__dirname + '/../../categories.json', (err, data) => {
            if (err) throw err;
            else {
                let dataJSON = JSON.parse(data);
                dataJSON["categories"].forEach((item, i) => {
                    var cate = new Category(item);
                    cate.save().then(
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