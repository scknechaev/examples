var nodemailer     	  = require('nodemailer'),
	fs				  = require('fs'),
	transportSettings = sails.config.mailer,
	mailerSettings 	  = {
		from: 'noreply.mpf@gmail.com',
		to: '',
		subject: 'Confirm your email',
		text: '',
		html: ''
	},
	templatesPath     = __dirname + '/../../views/email',
	transporter    	  = nodemailer.createTransport(transportSettings),
	templates 		  = {};

async.waterfall([
		function (call) {

			fs.readdir(templatesPath, function (err, templates) {	// reading templates from directorie
				
				if (err) {
					call(err);
				}

				call(null, templates);
			})
		}, function (templates, call) {

			async.map(templates, function (fileName, next) { // reading contents of the each file in the directorie

				fs.readFile(templatesPath + '/' + fileName, { encoding: 'utf8' }, function (err, content) {

					if (err) {
						next();
					}

					next(null, {
						name: fileName.replace('.tpl', ''),
						html: content
					});
				});
			}, call);
		}
	], function (err, data) {
		if (err) {
			return console.log(err);
		}

		data.forEach(function (file) {			// setting generating html templates to templates object
			templates[file.name] = _.template(file.html);
		});
});

module.exports = {
	send: function (letter, data) {
		var settings = {};

		settings 	  = _.extend( {}, mailerSettings, _.pick(letter, 'subject', 'to', 'text', 'cc', 'bcc') );
		settings.html = templates[letter.template](data || {});

		transporter.sendMail(settings, function(err, info) {
	        if (err) {
	           return console.log(err);
	        }

	        console.log('Email sending');
	    });
	}
};
