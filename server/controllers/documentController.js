const Document = require("./../mongodb/models/Document")
const User = require("./../mongodb/models/User")
const mongoose = require("mongoose")

// Get all documents based on query params, which should include the userid
const getDocuments = async (req, res, next) => {

    try {

        const id = req.query.id

        // Get the user first
        const user = await User.findById(id)

        // Get documents from this user
        const documents = await Document.find({_id: {$in: user.documents}}).sort({updatedAt: -1})

        res.status(200).json(documents)

    } catch(e) {
        console.log(e)
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

        let {user, id, title, data} = req.body

        // The ID field needs to be filled out
        if (!id) {
            let err = new Error("ID field is required for a new document")
            err.status = 400
            err.redirect = true
            throw err
        }

        title = title ?? "" 
        data = data ?? {}

        // Create the new document
        const document = await Document.create({ _id: id, title, data, users: [user] })

        // Add the id of this document to the list of documents of the user
        await User.updateOne({_id: user}, {$push: {documents: id}})

        res.status(200).json(document)

    } catch(e) {
        console.log(e)
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

// Share a document with another user
const shareDocument = async (req, res, next) => {

    try {

        const { id } = req.params
        const { email } = req.body

        // First, find the user by email and update their document
        const user = await User.findOneAndUpdate({email}, {
            $push: {documents: id}
        })

        if (!user) {
            let err = new Error("User not found")
            err.status = 400
            err.redirect = false
            throw err
        }

        // Then, add the user id to the document
        await Document.updateOne({_id: id}, {
            $push: {users: user._id}
        })

        res.status(200).json({})


    } catch(e) {
        next(e)
    }

}

module.exports = {
    getDocument,
    getDocuments,
    createDocument,
    deleteDocument,
    updateDocument,
    shareDocument
}