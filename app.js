const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorMiddleware = require("./middleware/error")

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));

const product = require("./routes/productRoute");
const user = require("./routes/userRoute")

app.use("/api", product);
app.use("/api", user);

app.get("/", (req, res) => {
    res.send("Figurz api on vercel.");
});

//middleware for errors
app.use(errorMiddleware)

module.exports = app

