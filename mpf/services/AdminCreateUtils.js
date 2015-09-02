'use strict';

module.exports = {

    isKeyCorrect: function (recivedKey) {
        return sails.config.secretKey.key === recivedKey;
    },

    adminAlreadyPresent: function (params, call) {

        async.parallel({
            emailFind: function (next) {
                
                User.find({
                    'email': params.email
                }).exec(function (err, user) {
                    
                    if (err) {
                        return next(err);
                    }
                    
                    next(null, user);
                });
            },
            roleFind: function (next) {
                
                User.find({
                    'role': 3
                }).exec(function (err, admin) {
                    
                    if (err) {
                        return next(err);
                    }
                    
                    next(null, admin);
                });
            }
        }, function (err, result) {
            var isPresent;

            if (err) {
                return call(err);
            }

            isPresent = checkUserPresents(result)

            call(isPresent);
        });
    },

    createAdmin: function (data, call) {

        data.role = 3;

        User.create(data).exec(function (err, createdAdmin) {
            call(err, createdAdmin)
        });
    }

};

function checkUserPresents (result) {
    var emailError      = {
            error: 'User with such email already presents'
        },
        roleError       = {
            error: 'Admin already presents'
        },
        byEmailPresents = result.emailFind.length,
        byRolePresents  = result.roleFind.length;

    if (byEmailPresents || byRolePresents) {

        if (byEmailPresents) {
            return emailError;
        }

        return roleError;
    }

    return null;
}