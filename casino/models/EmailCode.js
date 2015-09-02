/**
* EmailCode.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var crypto = require('crypto'),
    moment = require('moment');

module.exports = {

    schema: true,
    autoUpdatedAt: false,

    attributes: {

        code: {
            type: 'string'
        },

        activated: {
            type: 'boolean',
            defaultsTo: false
        },

        type: {
            type: 'integer'
        },

        expiresAt: {
            type: 'datetime',
            defaultsTo: function () { return moment().add(24, 'h').toDate(); }
        },

        user: {
            model: 'User'
        }

    },

    beforeCreate: function (emailCode, cb) {
        crypto.randomBytes(48, function(ex, buf) {
            emailCode.code = buf.toString('base64').replace(/\//g,'_').replace(/\+/g,'-');
            cb(null, emailCode);
        });
    }

};