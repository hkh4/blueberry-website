const User = require("./../mongodb/models/User")
const jwt = require("jsonwebtoken") 

// Function to create a jwt
const createToken = (_id, admin) => {
    return jwt.sign({_id, admin}, process.env.SECRET, {expiresIn: '3d'}) 
}

// Login user
const loginUser = async (req, res, next) => { 

    try {
        const {email, password} = req.body 

        // Log in using static method on User schema
        const user = await User.login(email, password)

        // Create a token
        const token = createToken(user._id, user.admin)

        res.status(200).json({id: user._id, email, token})

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
        const token = createToken(user._id, false) 

        res.status(200).json({id: user._id, email, token, documents: []})

    } catch(e) {
        next(e)
    }
}

// Update a user
const updateUser = async (req, res, next) => {

    try {

        const { id } = req.params
        const user = await User.findOneAndUpdate({_id: id}, {
            ...req.body
        })

        // If the user isn't found
        if (!user) {
            let err = new Error("Failed to update user")
            err.status = 500
            err.redirect = false
            throw err
        }
        
        res.status(200).json(user)

    } catch(e) {
        next(e)
    }

}

module.exports = { loginUser, signupUser, updateUser }