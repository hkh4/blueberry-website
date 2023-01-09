const User = require("./../mongodb/models/User")
const jwt = require("jsonwebtoken") 

// Function to create a jwt
const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '3d'})
}

// Login user
const loginUser = async (req, res, next) => {

    try {
        const {email, password} = req.body 

        // Log in using static method on User schema
        const user = await User.login(email, password)

        // Create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})

    } catch(e) {
        next(e)
    }
}

// Signup user
const signupUser = async (req, res, next) => {

    try {
        const {email, password} = req.body

        // The signup functionality is stored as a static function on the User schema.
        const user = await User.signup(email, password)

        // Create a token
        const token = createToken(user._id)

        res.status(200).json({email, token})

    } catch(e) {
        next(e)
    }
}

module.exports = { loginUser, signupUser }