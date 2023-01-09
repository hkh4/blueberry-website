const { Schema, model } = require("mongoose")
const bcrypt = require("bcrypt")
const validator = require("validator")

const User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

// Static sign up method
User.statics.signup = async function(email, password) {

    // *********  Validation

    // Default error
    let e = new Error("")
    e.status = 400

    // Email or password cannot be empty
    if (!email || !password) {
        e.message = "All fields must be filled" 
        throw e
    }

    // Make sure email is a valid email
    if (!validator.isEmail(email)) {
        e.message = "Email is not valid"
        throw e
    }

    // Check if password is strong enough (min 8 chars, 1 lowercase, 1 uppercase, 1 number, 1 symbol)
    if (!validator.isStrongPassword(password)) {
        e.message = "Password not strong enough"
        throw e
    }

    // Make sure the email is unique. If an account already exists with this email, throw an error
    const exists = await this.findOne({ email })
    if (exists) {
        e.message = "Email already in use"
        throw e
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    // Save new user
    const user = await this.create({ email, password: hash })

    return user
}


// Login method
User.statics.login = async function(email, password) {

    // Default error
    let e = new Error("")
    e.status = 400

    // Email or password cannot be empty
    if (!email || !password) {
        e.message = "All fields must be filled"
        throw e
    }

    // Find the user
    const user = await this.findOne({ email })

    // If the user isn't found, throw an error
    if (!user) {
        e.message = "Incorrect email"
        throw e
    }

    // Compare passwords. NOTE: bcrypt stores the salt in the hashed password itself, so it isn't needed for comparing!
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
        e.message = "Incorrect password"
        throw e
    }

    return user

}

module.exports = model("User", User)