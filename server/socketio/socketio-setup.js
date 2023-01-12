const findOrCreateDocument = require("./../mongodb/helpers/findOrCreateDocument")
const Document = require("./../mongodb/models/Document")

module.exports = function socketIO_setup(http) {

    const io = require('socket.io')(http, {
        cors: {
          origin: process.env.NODE_ENV == "production" ? 'https://blueberry-website.herokuapp.com' : 'http://localhost:3000',
          methods: ['GET', 'POST']
        }
      })
      
      io.on("connection", socket => {
      
        // When a document first loads, the client emits "get-document" along with the ID of that document
        // This function joins a room for this document, and if info for this document has been saved before, it gets it from the database and returns it
        socket.on('join-document-room', async documentID => {
  
          socket.join(documentID)
          socket.emit('joined-document-room')
      
          // To allow for collaboration, when a change is made in the editor, send those changes to everyone else in the document
          socket.on('send-changes', delta => {
            socket.broadcast.to(documentID).emit("receive-changes", delta) 
          })
        })
      
      })

}
