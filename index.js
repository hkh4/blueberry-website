require('dotenv').config()
const express = require('express');
const path = require('path');
const cors = require('cors')  


// API routes
const test = require("./server/routes/test")
const documentRoutes = require("./server/routes/documents")
const userRoutes = require("./server/routes/user")


// Express setup
const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())
app.use("/api", test)
app.use("/api/documents", documentRoutes)
app.use("/api/user", userRoutes)
const http = require("http").Server(app)


// Config
require("./server/mongodb/mongoose-setup")
const socketIO_setup = require("./server/socketio/socketio-setup")
socketIO_setup(http)

// Error handling
app.use((error, req, res, next) => {

  res.status(error.status || 500)
  res.json({
    error: {
      status: error.status || 500,
      message: error.message,
      redirect: error.redirect || false
    }
  })
})


app.use(express.static('client/build'))

app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"))
})

http.listen(process.env.PORT || 6000, () => {
   console.log("Running on port 6000");
})
