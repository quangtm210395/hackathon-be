const jwt = require('jsonwebtoken');
const config = require('../../configs');
const Post = require('../../api/post/post.model');
const Comment = require('../../api/comment/comment.model');

module.exports = {
    authentication: function (req, res, next) {
        if (req.body || req.headers || req.query) {
            var token = req.body.token || req.query.token || req.headers['token'];
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    console.log(err);
                    res.status(401).json({
                        status: false,
                        msg: 'Please login first!'
                    });
                } else {
                    req.user = decoded.data;
                    next();
                }
            });
        } else res.status(401).json({
            status: false,
            msg: 'Please login first!'
        });
    },

    hasRole: function (requiredRole) {
        return function (req, res, next) {
            var roles = config.roles;
            var role = req.user.role;
            if (roles.indexOf(role) >= roles.indexOf(requiredRole))
                next();
            else {
                res.status(403).json({
                    status: false,
                    msg: 'Your role must be ' + requiredRole + ' or higher to do this!'
                });
            }
        };
    },

    hasPer: function (api) {
        return function (req, res, next) {
            console.log(req.user.role);
            if (req.user.role == 'admin') next();
            else {
                console.log(1);
                if (api == 'post') {
                    Post.findOne({
                            _id: req.params.id
                        })
                        .exec((err, post) => {
                            if (err) res.json({
                                status: false,
                                message: err.message
                            });
                            else {
                                if (post.author == req.user._id) next();
                            }
                        });
                } else {
                    Comment.findOne({
                            _id: req.params.id
                        })
                        .exec((err, comment) => {
                            if (err) res.json({
                                status: false,
                                message: err.message
                            });
                            else {
                                if (comment.created_by == req.user._id) next();
                            }
                        });
                }
            }
        }
    },

    hasPermission: function (api, requiredPermission) {
        return function (req, res, next) {
            if (req.user.role == 'admin') next();
            var permissions = config.permissions;
            var userPermission = req.user.permission;
            userPermission.forEach((per, i) => {
                if (per[api]) {
                    if (permissions.indexOf(per[api]) >= permissions.indexOf(requiredPermission))
                        next();
                    else res.status(403).json({
                        status: false,
                        msg: 'Your do not have permission to do this!'
                    });
                }
            });
        }
    }
}