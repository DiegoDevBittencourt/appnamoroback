const jwt = require('jsonwebtoken')

module.exports = payload => {

    const generateToken = jwt.sign({ payload }, process.env.JWT_SECRET, {
        expiresIn: 7200//2hrs
    })

    return generateToken;
}
