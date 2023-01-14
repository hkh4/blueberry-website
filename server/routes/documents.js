const router = require("express").Router()
const {
    getDocument,
    getDocuments,
    createDocument, 
    deleteDocument,
    updateDocument,
    shareDocument
} = require("../controllers/documentController")

const requireAuth = require("./../middleware/requireAuth")

// Require auth for all document routes
router.use(requireAuth)

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

// Share with another user
router.patch('/share/:id', shareDocument)


module.exports = router