require('dotenv').config()
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

// // Replace NAME and DB. Add MONGOPASS to the .env
// mongoose.connect(`mongodb+srv://<NAME>:${process.env.MONGOPASS}@cluster0.bcdcw.mongodb.net/<DB>?retryWrites=true&w=majority`, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//
// mongoose.set("useCreateIndex", true)

// This will be used when deploying to heroku
app.get("*", (req,res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"))
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Running on port 5000");
})
