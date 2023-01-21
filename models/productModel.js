const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        category: {type: Array, required: true},
        price: {type: Number, required: true},
        ratings: {type: Number, default: 0},
        images:[{type: String}],
        stock: {type: Number, required: true, maxLength: [3, "Stock can't be >= 1000"], default: 1},
        sizes: {type: Array },
        numOfReviews: {type: Number, default: 0},
        reviews: [
            {
                name: {type: String, required: true},
                rating: {type: Number, required: true},
                comment: {type: String, required: true},
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);