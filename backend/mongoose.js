const mongoose = require("mongoose")
const isDev = process.env.isDev !== "false"
mongoose
  .connect(
    `mongodb+srv://michaelma:footballwork@cluster0.s8vjq.azure.mongodb.net/parknshop${
      isDev ? "__test" : ""
    }?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err))

module.exports = mongoose
