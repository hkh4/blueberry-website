const mongoose = require('mongoose');

// Connect mongoose
mongoose.set('strictQuery', true);

// Connect to the production or development database depending on env variable
if (process.env.NODE_ENV === "production") {
  mongoose.connect(`mongodb+srv://blueberry:${process.env.MONGOPASS}@blueberry-production.ipb2g.mongodb.net/?retryWrites=true&w=majority`)
} else {
  mongoose.connect(`mongodb+srv://blueberry:${process.env.MONGOPASS}@blueberry-development.ipb2g.mongodb.net/?retryWrites=true&w=majority`)
}

