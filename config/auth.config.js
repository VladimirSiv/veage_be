module.exports = {
  access_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_secret: process.env.REFRESH_TOKEN_SECRET,
  cookie_secret: process.env.COOKIE_SECRET,
  algorithm: process.env.TOKEN_ALGO,
  access_expiresIn: 900000, // 15min
  refresh_expiresIn: "7d",
  cookie_httpOnly: true,
  cookie_signed: true,
};
