module.exports = function (req, res, next) {

    var user 	   = req.session.passport.user,
    	errMessage = 'Only administrator can perform this action';

    if (user) {
    	User.findOne(user).exec(AsyncUtils.ormCallback(function (user) {

    		if (user && (user.role === 3) ) {	// user have come as administrator
    			next();
    		} else {
				res.forbidden(errMessage);
    		}
    	}, res));
    } else {
        res.forbidden(errMessage);
    }
};