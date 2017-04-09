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
                            msg: err
                        });
                    }
                    if (!user) res.status(404).json({
                        status: false,
                        msg: "This account is not register"
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
                                msg: "Login successful",
                                token: token
                            });
                        } else {
                            res.status(403).json({
                                status: false,
                                msg: "Password incorrect"
                            });
                        }
                    }
                });
        } else {
            res.status(404).json({
                status: false,
                msg: "Cannot login!"
            })
        }

    }
}