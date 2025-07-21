const app  = require("./app")
const dotenv = require("dotenv")
dotenv.config()
const connectDB = require("./utils/db")
app.listen(process.env.PORT,() =>{
    console.log(`server is connected with port ${process.env.PORT}`)
    connectDB()
})
