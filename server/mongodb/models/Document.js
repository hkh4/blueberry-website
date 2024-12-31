const { Schema, model, ObjectId } = require("mongoose")

const Document = new Schema({
    _id: String, 
    data: Object,
    title: String,
    type: {
        type: String,
        enum: ["tab", "lyric"]
    },
    users: [String]
}, { timestamps: true })

module.exports = model("Document", Document) 