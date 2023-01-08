const mongoose = require('mongoose');

// Connect mongoose
mongoose.set('strictQuery', true);
mongoose.connect(`mongodb+srv://blueberry:${process.env.MONGOPASS}@blueberry.ipb2g.mongodb.net/?retryWrites=true&w=majority`)
//  .then(() => console.log("Connected to mongoose"))