/**
 * AdminController
 *
 * @description :: Server-side logic for managing by admin of aplication
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var templatesTypes = {
 	'1': 'emailActivation',
 	'2': 'passReset' 
 };

module.exports = {
	isMailParamsAvails: function (params) {
		return params.header.trim() && params.body.trim() && params.footer.trim();
	},
	updateMailTemplate: function (params, res, call) {
		var templateType = templatesTypes[params.type],
			params 		 = _.pick(params, 'header', 'body', 'footer');

		if (!templateType) {
			return res.badRequest('Template with such type not found');
		}

		this.findTemplate(templateType, AsyncUtils.ormCallback(function (mailTemplate) {
			_.extend(mailTemplate, params);

			mailTemplate.save(function (err, template) {

				if (err) {
					return res.badRequest(err);
				}

				call(template);
			});
		}, res));
	},
	findTemplate: function (type, call) {
		EmailTemplate.findOne(type).exec(call);
	},
	getEmailsType: function (templateType) {
		return templatesTypes[templateType];
	}
};