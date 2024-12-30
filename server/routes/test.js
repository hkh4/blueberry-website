const router = require("express").Router()
const Document = require("./../mongodb/models/Document")

const requireAuth = require("./../middleware/requireAuth")

router.use(requireAuth)

// Update all documents to add the type field
router.patch("/add-type", async (req, res, next) => {
    try {

        const aggResult = await Document.updateMany(
            {}, // no filter, update everything
            { $set: { type: "tab" } }
        )

        res.status(200).json({aggResult})

    } catch(e) {
        console.log(e)
        next(e)
    }
})

module.exports = router