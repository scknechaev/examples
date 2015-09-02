/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var md5 = require('blueimp-md5').md5;

module.exports = {

  schema: true,
  
  attributes: {
  	email: {
  		type: 'string',
  		primaryKey: true,
      unique: true
  	},

  	name: {
  		type: 'string',
  	},

  	password: {
  		type: 'string',
  	},

    emailCode: {
      model: 'EmailCode'
    },
  },

  beforeCreate: function (user, call) {
    var pass  = user.password;

      // User.findOne({'email': email}).exec(function (err, existingUser) {

      //   if (err) {
      //     return call(err);
      //   }

      //   if (existingUser) {
      //     return call({ error: 'User name exists',
      //                   description: 'The user with same username already exists'
      //                 });
      //   }

    user.password = passwordHashing(pass);
    call(null, user);
      // });
  },
    
  beforeUpdate: function (user, call) {
    var pass = user.password;

    user.password = passwordHashing(pass);
    call(null, user);
  }
};

function passwordHashing (pass) {
  return md5(String(pass));
}