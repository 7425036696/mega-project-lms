const redis  = require("../utils/redis")
const { updateAccessToken } =  require("../controllers/user.controller")
const jwt  = require("jsonwebtoken");
const CatchAsyncError = require("./catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
// authenticated user
 const isAuthenticated = CatchAsyncError(
  async (req, res, next) => {
    const access_token = req.headers["access-token"] || req.cookies.access_token;
    if (!access_token) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }
    const decoded = jwt.decode(access_token) 
    if (!decoded) {
      return next(new ErrorHandler("access token is not valid", 400));
    }

    // check if the access token is expired
    if (decoded.exp && decoded.exp <= Date.now() / 1000) {
      try {
const refreshToken = req.cookies.refresh_token || req.headers["refresh-token"];
const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

const session = await redis.get(decodedRefresh.id);
if (!session) {
  return next(new ErrorHandler("Session expired. Please login again.", 401));
}

const user = JSON.parse(session);
req.user = user;

const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: process.env.ACCESSTOKEN_EXPIRE || "5m",
});

res.cookie("access_token", newAccessToken, {
  httpOnly: true,
  sameSite: "lax",
  maxAge: parseInt(process.env.ACCESSTOKEN_EXPIRE || "300", 10) * 1000,
});

// Now continue
next();
      } catch (error) {
        return next(error);
      }
    } else {
      const user = await redis.get(decoded.id);

      if (!user) {
        return next(
          new ErrorHandler("Please login to access this resource", 400)
        );
      }

      req.user = JSON.parse(user);

      next();
    }
  }
);

// validate user role
 const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
module.exports = {isAuthenticated,authorizeRoles}