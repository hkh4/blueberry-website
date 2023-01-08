const router = require("express").Router()
const {
    getDocument,
    getDocuments,
    createDocument,
    deleteDocument,
    updateDocument
} = require("../controllers/documentController")

// GET all documents
router.get('/', getDocuments)

// GET a single document
router.get('/:id', getDocument)

// POST a new document
router.post('/', createDocument)

// DELETE a document
router.delete('/:id', deleteDocument)

// UPDATE a document
router.patch('/:id', updateDocument)


module.exports = router