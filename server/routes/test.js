const router = require("express").Router()
const Document = require("./../mongodb/models/Document")
const User = require("./../mongodb/models/User")

const superUser = require("./../middleware/superUser")

router.use(superUser)

// Update all documents to add the type field
router.patch("/add-type", async (req, res, next) => {
    try {

        const res = await Document.updateMany(
            {}, // no filter, update everything
            { $set: { type: "tab" } }
        )

        res.status(200).json({res})

    } catch(e) {
        console.log(e)
        next(e)
    }
})

// Add in level 1 for all users
router.patch("/add-level", async (req, res, next) => {
    try {

        const res = await User.updateMany(
            {},
            { $set: { level: 1 } }
        )

        res.status(200).json({res})

    } catch(e) {
        console.log(e)
        next(e)
    }
})

module.exports = router