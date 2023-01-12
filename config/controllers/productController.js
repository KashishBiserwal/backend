const Product = require("../../models/productModel");
const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const ApiFeatures = require("../../utils/apiFeatures");

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true, 
        product
    });
});

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    
    const resultPerPage = 9;
    const productCount = await Product.countDocuments();
    
    const apiFeature = new ApiFeatures( Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products
    });
});

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    });
}); 

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators:true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("Product not found", 404))
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach(review => {
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating;
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true
    });
});   

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next (new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next (new ErrorHandler("Product not found", 404))
    }
    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
    let ratings = 0;
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    
    res.status(200).json({
        success: true,
    });
});