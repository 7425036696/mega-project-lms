const userModel = require("../models/user.model");
const ErrorHandler = require("../utils/ErrorHandler");
const CatchAsyncError = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const ejs = require("ejs");
const bcrypt = require("bcryptjs")
const redis = require("../utils/redis"); // Adjusted to match previous structure
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user.model");
const getUserById = require("../services/user.service"
  
)

const sendToken = require("../utils/jwt")
// Function to create an activation token
const createActivationToken = (user) => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret";
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  const token = jwt.sign({ user, activationCode }, secret, { expiresIn: "5m" });
  return { token, activationCode };
};

// User registration function
const registrationUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Check if email already exists
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email is already registered", 400));
    }

    // Create user object
    const user = { name, email, password };

    // Generate activation token and code
    const { token, activationCode } = createActivationToken(user);

    // Store activation code in Redis
    await redis.setex(`activation:${email}`, 300, activationCode);

    // Render EJS template
    const data = { user: { name: user.name }, activationCode };

    const templatePath = "C:/Users/mkjap/OneDrive/Desktop/lms-mega-project/server/mails/activation-email.ejs";
    const html = await ejs.renderFile(templatePath, data);

    // Send email
    await sendEmail({
      email: user.email,
      subject: "Activate your account",
      template: "activation-email.ejs",
      data,
    });

    // Respond with success
    res.status(201).json({
      success: true,
      message: `Please check your email: ${user.email} to activate your account!`,
      activationToken: token,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
const activateUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { activation_code, activation_token } = req.body
    const newUser = jwt.verify(
      activation_token,
      process.env.JWT_SECRET
    )
    if (newUser.activationCode !== activation_code) {
      return (next(new ErrorHandler("Invalid activation code", 400)))
    }
    const { name, email, password } = newUser.user
    const existUser = await User.findOne({ email })
    if (existUser) {
      return (next(new ErrorHandler("Email already exists", 400)))
    }
    const user = await userModel.create({
      name,
      email,
      password,
    })
    res.status(201).json({
      success: true,

    })

  } catch (error) {
    return next(new ErrorHandler(error.message, 400))
  }
})

const loginUser = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return (next(new ErrorHandler("Please provide both Email and Password", 400)))

    }
    const user = await userModel.findOne({ email })
    if (!user) {
      return (next(new ErrorHandler("Invalid Email or Password", 400)))

    }

    const isPaswordMatch = await user.comparePassword(password)
    if (!isPaswordMatch) {
      return (next(new ErrorHandler("Invalid email or Password", 400)))

    }
    sendToken(user, 200, res)
  } catch (error) {
    return (next(new ErrorHandler(error.message, 400)))
  }
})
const logoutUser = CatchAsyncError(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;

    // decode the refresh token to get user ID (don't verify, because it might be expired)
    let decoded;
    if (refreshToken) {
      decoded = jwt.decode(refreshToken);
    }

    if (decoded?.id) {
      await redis.del(decoded.id.toString());
    }

    // Clear cookies
    res.cookie("access_token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
    });

    res.cookie("refresh_token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updateAccessToken = CatchAsyncError(async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token || req.headers["refresh-token"];

    if (!refreshToken) {
      return next(new ErrorHandler("Refresh token missing", 401));
    }

    // 🔥 Correct secret
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      return next(new ErrorHandler("Invalid or expired refresh token", 401));
    }

    const session = await redis.get(decoded.id);
    if (!session) {
      return next(new ErrorHandler("Session expired. Please login again.", 401));
    }

    const user = JSON.parse(session);
    req.user = user;

    // Optional: extend Redis session again
    await redis.set(user._id, JSON.stringify(user), "EX", parseInt(process.env.REFRESHTOKEN_EXPIRE || "1200", 10));

    // Optionally issue new access token here
    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESSTOKEN_EXPIRE || "5m" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: parseInt(process.env.ACCESSTOKEN_EXPIRE || "300", 10) * 1000,
    });

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired refresh token", 401));
  }
});

const getUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user?._id
    getUserById(userId, res)
  } catch (error) {
    return (next(new ErrorHandler(error.message, 400
    )))
  }
})

const socialAuth = CatchAsyncError(async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      const newUser = await User.create({ name, email, avatar })
      sendToken(newUser, 200, res)
    }
    else {
      sendToken(user, 200, res)

    }

  } catch (error) {
    return (next(new ErrorHandler(error.message, 400
    )))
  }
})
const updateUserInfo = CatchAsyncError(async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Email Update Logic
    if (email) {
      if (email === user.email) {
        return next(new ErrorHandler("You already use this email", 400));
      }

      const isEmailExist = await User.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      user.email = email;
    }

    // Name Update Logic
    if (name) {
      user.name = name;
    }

    await user.save();

    // Update in Redis
    await redis.set(userId.toString(), JSON.stringify(user));

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

const updatePassword = CatchAsyncError(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (!newPassword || newPassword.length < 6) {
      return next(new ErrorHandler("New password must be at least 6 characters", 400));
    }

    user.password = newPassword; // Password will be hashed in schema middleware
    await user.save();

    await redis.set(userId.toString(), JSON.stringify(user));

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// Update Profile Picture Function
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");




const updateProfilePicture = CatchAsyncError(async (req, res, next) => {
  const file = req.file;
  if (!file) return next(new ErrorHandler("No file uploaded", 400));

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "avatars",
    public_id: `user_${Date.now()}`,
    transformation: [{ width: 500, crop: "scale" }],
  });

  fs.unlinkSync(file.path); // delete temp file

  res.status(200).json({
    success: true,
    message: "Profile picture updated",
    avatar: result,
  });
});








module.exports = { registrationUser, activateUser, loginUser, logoutUser, updateAccessToken, getUserInfo, socialAuth,updateUserInfo,updatePassword,updateProfilePicture };