/**
 * AdminController
 *
 * @description :: Server-side logic for managing creating of admin of aplication
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');

module.exports = {

	create: function (req, res) {
		var params = req.params.all() || req.body,
			key    = params.secret;

		async.waterfall([function (call) {

			AdminCreateUtils.adminAlreadyPresent(params, call);

		}, function (call) {

			if (!AdminCreateUtils.isKeyCorrect(key)) {
				return call({
					error: 'Secret key are not valid!'
				});
			}

			call(null);
		},function (call) {

			AdminCreateUtils.createAdmin(_.pick(params, 'username', 'email', 'password'), call);
			
		}], function (err, createdAdmin) {

			if (err) {
				return res.send(400, err);
			}
			
			res.send(200, {
				message: 'New admin successful created!',
				admin  : createdAdmin
			});
		});
	},

    setEmailTemplates: function (req, res) {
        var params = _.pick(req.params.all(), 'type', 'header', 'body', 'footer');

        if ( !AdminActionsUtils.isMailParamsAvails(params) ) {
            return res.badRequest('Some of params is empty');
        }

        AdminActionsUtils.updateMailTemplate(params, res, function (template) {
            res.ok(template);
        });
    }
};