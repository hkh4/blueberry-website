const mongoose = require("mongoose")
const Document = require("./../mongodb/models/Document")

// Get all documents
const getDocuments = async (req, res, next) => {

    try {

        const documents = await Document.find({}).sort({updatedAt: -1})
        res.status(200).json(documents)

    } catch(e) {
        next(e)
    }

}

// Get a single document
const getDocument = async (req, res, next) => {

    try {
        const { id } = req.params

        const document = await Document.findById(id)

        if (!document) {
            let err = new Error("Document does not exist")
            err.status = 404
            err.redirect = true
            throw err
        }

        res.status(200).json(document)
    } catch(e) {
        next(e)
    }
    
}

// Create new document
const createDocument = async (req, res, next) => {

    try {

        let {id, title, data} = req.body

        // The ID field needs to be filled out
        if (!id) {
            let err = new Error("ID field is required for a new document")
            err.status = 400
            err.redirect = true
            throw err
        }

        title = title ?? ""
        data = data ?? ""

        // Create the new document
        const document = await Document.create({ _id: id, title, data })

        res.status(200).json(document)

    } catch(e) {
        next(e)
    }
}

// Delete a document
const deleteDocument = async (req, res, next) => {

    try {

        const { id } = req.params
        const document = await Document.findOneAndDelete({_id: id})

        // If nothing is returned, then it failed to delete
        if (!document) {
            let err = new Error("Failed to delete a document")
            err.status = 500
            err.redirect = false
            throw err
        }

        res.status(200).json(document)


    } catch(e) {
        next(e)
    }
}

// Update a document
const updateDocument = async (req, res, next) => {

    try {

        const { id } = req.params 
        const document = await Document.findOneAndUpdate({_id: id}, {
            ...req.body
        })

        // If this document isn't found
        if (!document) {
            let err = new Error("Failed to update document")
            err.status = 500
            err.redirect = false 
            throw err
        }

        res.status(200).json(document)

    } catch(e) {
        next(e)
    }
}

module.exports = {
    getDocument,
    getDocuments,
    createDocument,
    deleteDocument,
    updateDocument
}