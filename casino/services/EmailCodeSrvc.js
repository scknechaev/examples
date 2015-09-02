module.exports = {

    /**
     * @description :: Checking user code is it available
     *
     * @emailCode - Email code object that finds in DB by id receving from client
     * @params    - params that transfered to the server from client by get method
     * @call      - next callback that will be called in async
     */
    checkUserCode: function (emailCode, params, call) {

        if (!this.isCodeStiilAvailable(emailCode.expiresAt)) {
            return call({
                'error': 'Code is not available any more'
            });
        }

        if (this.isEmailCodeActive(emailCode)) {
            return call({
                'error': 'Code already activated'
            });
        }

        if (this.isCodesEquals(emailCode.code, params.code)) {

            emailCode.activated = true;
            emailCode.save(function (err) {

                if (err) {
                    return call(err);
                }

                call(null, emailCode);
            });
        } else {
            call({
                'error': 'Confirmation codes does not equals'
            });
        }
    },

    /**
     * @description :: Checking is code is available, by comparison of two times
     *
     * @expiresTime - time when email code is not available any more
     */
    isCodeStiilAvailable: function (expiresTime) {
        var currTime = (new Date()).getTime();

        return expiresTime >= currTime;
    },

    /**
     * @description :: Checking is code from db and code receving from client is equals
     *
     * @dbCode      - code from data base
     * @recivedCode - receving code from client
     */
    isCodesEquals: function (dbCode, recivedCode) {
        return dbCode.toLowerCase() === recivedCode.toLowerCase();
    },

    /**
     * @description :: Checking is code from db already activated
     *
     * @emailCode - code from data base
     */
    isEmailCodeActive: function (emailCode) {
        return emailCode.activated;
    }
};