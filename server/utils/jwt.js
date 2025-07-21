require("dotenv").config();
const redis = require("../utils/redis");

const sendToken = (user, statusCode, res) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  const accessTokenExpire = parseInt(process.env.ACCESSTOKEN_EXPIRE || "300", 10);
  const refreshTokenExpire = parseInt(process.env.REFRESHTOKEN_EXPIRE || "1200", 10);

  const accessTokenOptions = {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
  };

  const refreshTokenOptions = {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
  };

  if (process.env.NODE_ENV === "production") {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  // Save user session in Redis
  redis.set(user._id.toString(), JSON.stringify(user), "EX", refreshTokenExpire);

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  return res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};

module.exports = sendToken;
