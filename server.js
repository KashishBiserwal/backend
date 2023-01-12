const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database")

//Handling uncaught exceptions
process.on("uncaughtException", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
});

dotenv.config({path: "config/config.env"});

//Database Connection
connectDatabase();

const server = app.listen(4000, ()=>{
    console.log("Server is running...");
})

//Unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
});