var User = require('../user/user.model');

var jwt = require('jsonwebtoken');
var config = require('../../configs');

module.exports = {
    login: (req, res) => {
        if (req.body) {
            User.findOne({
                    username: req.body.username
                })
                .exec((err, user) => {
                    if (err) {
                        console.log(err);
                        res.status(400).json({
                            status: false,
                            message: err
                        });
                    }
                    if (!user) res.status(404).json({
                        status: false,
                        message: "This account is not register"
                    });
                    else {
                        if (user.authenticate(req.body.password)) {
                            var token = jwt.sign({
                                data: user
                            }, config.secret, {
                                expiresIn: '7d'
                            });
                            res.status(202).json({
                                status: true,
                                message: "Login successful",
                                token: token
                            });
                        } else {
                            res.status(403).json({
                                status: false,
                                message: "Password incorrect"
                            });
                        }
                    }
                });
        } else {
            res.status(404).json({
                status: false,
                message: "Cannot login!"
            })
        }

    },

    register: (req, res) => {
        if (req.body) {
            var user = new User(req.body);
            console.log(req.body);
            user.save((err, user) => {
                if (err) res.json({status:false, message: 'Cannot register'});
                else {
                    res.status(201).json({
                        status: true,
                        message: 'Register successful!',
                        result: user
                    });
                }
            });
        } else {
            res.status(400).json({
                status: false,
                message: "Cannot register!"
            });
        }
    }
}