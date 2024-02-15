const setRateLimit = require("express-rate-limit");
const rateLimiter = setRateLimit({
  windowMs: 60 * 1000,
  max: 250,
  message: "You have exceeded your 200 requests per minute limit.",
  headers: true,
});

module.exports = rateLimiter;
