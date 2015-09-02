module.exports = function (req, res, next) {
    if (req.isAuthenticated) {
        if (req.user) {
            return next(req.user);
        }
    } else {
        return res.send(401, {message: 'user is not authenticated'})
        //return res.redirect('/login');
    }
};