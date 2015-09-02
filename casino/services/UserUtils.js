var moment = require('moment');

module.exports = {

    /**
     * @description :: Create a new user for casino, send email with activation code
     *
     *
     */
    createNewUser: function (options, cb) {
        User.findOne({ email: options.email })
            // .populate('emailCode')
            .exec(function (err, user) {

                if (err) {
                    return cb(err);
                }

                if (user) {
                    // if (EmailCodeSrvc.isEmailCodeActive(user.emailCode)) {
                    //     return cb({ 
                    //         'error': { summary: 'Code already activated' } 
                    //     });
                    // }

                    cb({
                        'error': 'User already registered'
                    });
                } else {
                    async.auto({
                        user: function (call) {
                            User.create({
                                'email'   : options.email.trim(),
                                'password': options.password,
                                'name'    : options.name
                            }, call);
                        },
                        emailCode: ['user', function (call, data) {
                            console.log(data.user.id);
                            EmailCode.create({
                                user: data.user.id
                            }, call);
                        }],
                        updateUser: ['user', 'emailCode', function (call, data) {
                            console.log(data.emailCode.id);
                            data.user.emailCode = data.emailCode.id;
                            data.user.save(call);
                        }]
                    }, function (err, data) {
                        
                        if (err) {
                            return cb(err);
                        }

                        Email.send({
                            to: data.user.email,
                            subject: 'Casino - Email activation',
                            template: 'emailActivation'
                        }, {
                            user: data.user,
                            emailCode: data.emailCode
                        });
                        cb(null, data);
                    });
                }
            });
    }
};