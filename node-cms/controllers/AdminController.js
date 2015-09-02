
var fs = require('fs');
var path = require('path');
module.exports = {

    myprotected: function (req, res) {

    	return res.view('indexAdmin', {
        	layout: false
    	})
    }
};
