const express = require("express");
const {
  registrationUser,
  activateUser,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  socialAuth,
  updateUserInfo,
  updatePassword,
  updateProfilePicture
} = require("../controllers/user.controller");

const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

// ✅ Import multer middleware
const upload = require("../middleware/multer.js"); // Make sure this path is correct

const userRouter = express.Router();

// Auth routes
userRouter.post("/registration", registrationUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", loginUser);
userRouter.get("/logout", isAuthenticated, logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);

// Profile
userRouter.put("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.put("/update-user-password", isAuthenticated, updatePassword);

// ✅ Profile Picture
userRouter.post(
  "/update-profile-picture",
  upload.single("avatar"),
  updateProfilePicture
);

// Social
userRouter.post("/social-auth", socialAuth);

module.exports = userRouter;
