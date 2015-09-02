var passport = require('passport');

module.exports = {

    isLogedin: function (req, res) {
        //  console.log("");
    },
    login: function (req, res) {
        if (req.method === 'GET') {
            return res.view('admin/loginAdmin.ejs');
        }

        passport.authenticate('local', function (err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }
            user.email = user.email.toLocaleLowerCase();
            req.logIn(user, function (err) {
                if (err) {
                    res.send(err);
                }
                /*   return res.send({
                   message: info.message,
                   user: user
                   });*/

                return res.redirect('/admin');
            });

        })(req, res);
    },
    logout: function (req, res) {
        req.logOut();
        res.redirect('/login');
    },

    register: function (req, res) {
        if (req.method === 'GET') {
            return res.view('admin/registerAdmin');
        }
        var email = req.body.email.toLowerCase();

        User.create({name: req.body.name, email: email, password: req.body.password, role: req.body.role}, function (err, created) {
            if (!err) {
                return res.send({message: 'user created', user: created});
            }
        })
    },

    createUser: function (req, res) {
        var email = req.body.email.toLocaleLowerCase();
        User.create({name: req.body.name, email: email, password: req.body.password, role: req.body.role}, function (err, created) {
            if (err) {
                res.send(400, {message: 'cannot create user'} );
            } else {

                return res.send({message: 'user created', user: created});
            }
        })
    },

    removeUser: function (req, res) {
        var userid = req.param('id');
        User.destroy({id: userid}).exec(function (err, deletedUser) {
            if (err) {
                res.send(400, 'cannot update user ');
            } else {
                return res.send({message: 'user deleted', user: deletedUser});
            }
        })
    },

    updateUser: function (req, res) {
        var id = req.param('id')

    }
}
