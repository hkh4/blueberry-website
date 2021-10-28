require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const test = require("./api/test")

const app = express();
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use("/api", test)


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

app.listen(process.env.PORT || 5000, () => {
   console.log("Running on port 5000");
})
