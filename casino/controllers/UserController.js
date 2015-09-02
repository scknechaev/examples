/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {

	_config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

	create: function (req, res) {
		var pass    = req.param('password'),
			email   = req.param('email'),
            name    = req.param('name'),
            options = {};

   		if (!paramsIsValid(pass, email, name)) { // is all transfered params is valid
   			return res.send(400, { error: { summary: 'Sending incrorrect data' }});
   		}

   		_.extend(options, {
   			'password': pass,
   			'email'   : email,
   			'name'    : name
   		});

		async.auto({
			registUser: function (call) {
				UserUtils.createNewUser(options, call);
			},
			auth: ['registUser', function (call, data) {
				// req.logIn(data.registUser.user, call);
				call(null, data);
			}]
		}, function (err, data) {

			if (err) {
				return res.send(400, err);
			}

			res.send(200, _.pick(data, 'email', 'name')) ;
		});
	},

	activateViaLink: function (req ,res) {
		var params = req.params.all();

        if (!params.ref || !params.code) {
            return res.badRequest();
        }
		
		async.waterfall([function (call) {

			EmailCode.findOne({
				'id': params.ref
			}, function (err, emailCode) {

				if (err) {
					return call(err);
				}

				if (emailCode === undefined) {
					return call({
						'error' : 'Such email code does not exist'
					});
				}

				call(null, emailCode);
			});
		}, function (emailCode, call) {

			EmailCodeSrvc.checkUserCode(emailCode, params, call);

		}, function (emailCode, call) {
			var emailCodeId = params.ref || emailCode.id;

			User.findOne({
				'emailCode': emailCodeId
			}, function (err, user) {

				if (err) {
					return call(err);
				}

				call(null, user);
			});

		}], function (err, user) {

			if (err) {
				return res.view('./registrFinish/', {
					'res': err
				});
			}
			
			res.view('./registrFinish/', {
				'res': _.pick(user, 'name', 'email')
			}, function (err, html) {

				if (err) {
					console.log('Some error while rendering!');
					return res.send(400, err);
				}

				res.send(200, html);
			});
		});
	},

	activate: function (req, res) {
		var confCode = req.body.code;

		async.waterfall([
				function (call) {

					EmailCode.findOne({
						'code' : confCode
					}).exec(function (err, emailCode) {

						if (err) {
							return call(err);
						}

						if (emailCode === undefined) {
							return call({
								error: 'Email code not found!'
							});
						}

						call(null, emailCode);
					});
				}, function (emailCode, call) {
					EmailCodeSrvc.checkUserCode(emailCode, {'code': confCode}, call);
				}
			], function (err, emailCode) {
			
				if (err) {
					return res.send(400, err);
				}

				res.send(200, emailCode);
		});
	},

	logIn: function (req, res) {
		passport.authenticate('local', function (err, user, info) {
            if ((err) || (!user)) {
                return res.send({
                    message: info.message,
                    user: user
                });
            }

            req.logIn(user, function (err) {
                if (err) {
                    return res.send(err);
                }

            	res.send({
                	'user': user
                });
            });

        })(req, res);
	},

	logOut: function (req, res) {
		req.logOut();
        res.send(200, {message: 'Successful logouted!'});
	},

	// personalArea: function (req, res) {
	// 	return res.send(200, {message: 'success!'});
	// }
};

// function createNewUser (req, res, email, name, pass) {
// 		User.create({						
// 			'email': email,	
// 			'name': name,
// 			'password': pass
// 		}).exec(function (err, createdUser) {
			
// 			if (err) {
//                 return res.send(400, {message: 'Error while creating user'} );
//             } 
            
//             res.send({message: 'user created', user: createdUser});
// 		})
// }

function paramsIsValid (pass, email, name) {
	return passIsOk(pass) && emailIsOk(email) && nameIsOk(name);
}

function passIsOk (pass) {
  return String(pass).length && (String(pass).length >= 8);
}

function emailIsOk (email) {
	return String(email).length && (String(email).indexOf('@') > -1);
}

function nameIsOk (name) {
	return !!name.trim();
}