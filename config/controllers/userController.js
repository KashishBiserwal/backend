const ErrorHandler = require("../../utils/errorHandler");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const User = require("../../models/userModel");
const sendToken = require("../../utils/jwtToken");

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
    const {name, email, password} = req.body;
    const user = await User.create({
        name, email, password
    });

    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async(req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler("Please enter email and password", 400));
    }
    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401));
    }
    sendToken(user, 200, res);
});

exports.logout = catchAsyncErrors(async(req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged out"
    })
})


exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})

exports.getAllUsers = catchAsyncErrors(async(req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})

exports.getUserDetails = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user
    })
})

exports.deleteUser = catchAsyncErrors(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

