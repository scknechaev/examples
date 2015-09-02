
module.exports = function (req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }    else {
      //  res.send('401', { message: 'unauthorized'});

         return res.redirect('/login');
    }
};
