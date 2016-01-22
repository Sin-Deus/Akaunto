function userService() {

    var USER_CREDENTIALS = {
        'name': null,
        'password': null
    };

    return {

        /**
         * Returns the logged user credentials.
         * @returns {{name, password}}
         */
        'getUserCredentials': function () {
            return USER_CREDENTIALS;
        }
    }
}

export default userService;
