const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

dotenv.config({path: "config/config.env"});

connectDatabase();

app.listen(4000, ()=>{
    console.log("Server is running...");
})