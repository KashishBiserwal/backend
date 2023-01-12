const express = require("express");
const { registerUser, loginUser, logout, getUserDetails, getAllUsers, deleteUser } = require("../config/controllers/userController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logout)
router.route("/me").get(isAuthenticatedUser, getUserDetails)
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)
router.route("/admin/user/:id")
    .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

module.exports = router;