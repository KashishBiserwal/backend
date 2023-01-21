require ("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/productModel.js");
const productsJson = require("./products.json");

const start = async () => {
    try {
       mongoose
            .set('strictQuery', false)
            .connect("mongodb+srv://kashish:dbpassword@cluster0.nmfc0ty.mongodb.net/?retryWrites=true&w=majority")
        // await Product.deleteMany({});
        await Product.create(productsJson);
        console.log("success");
    } catch (error) {
        console.log(error);
    }
}

start();