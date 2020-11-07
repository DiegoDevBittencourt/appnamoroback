module.exports = {

    validatePassword(password) {
        if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/u.test(password))
            return false;

        return true;
    },

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
}
