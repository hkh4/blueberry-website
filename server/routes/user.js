const router = require("express").Router()
const {
    loginUser,
    signupUser,
    updateUser
} = require("./../controllers/userController")

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// UPDATE a document
router.patch('/:id', updateUser)



module.exports = router