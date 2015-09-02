module.exports = {
    types: {
        isValidExp: function (url) {
            var regex = /^([\/\w\.]*)*\/?$/ ;

            return regex.test(url);
        }
    },
    attributes: {
        title: {
            type: 'string'
        },
        url: {
            type: 'string',
            unique: true,
            required: true,
            isValidExp: true
        },
        html: {
            type: 'string'
        }
    },
    beforeValidate: function (values, next) {
        console.log(arguments);

        if (values.url !== undefined) {
            if (values.url[0] === '/') {
                values.url =  values.url.slice(1);
                next();
            } else {
                next();
            }
        }
    },
    afterValidate: function (values, next) {
        console.log(values);
        next();
    },
    afterDestroy: function (destroyedRecords, cb) {
        async.map(destroyedRecords, function (page, next) {
            Navigation.destroy({
                page: page.id
            }, next);
        }, cb);
    }
};
