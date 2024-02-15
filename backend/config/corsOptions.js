const whitelist = ["https://yoursite.here/", "http://localhost:3500", "http://localhost:3000", undefined];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not whitelisted, check config"));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = { corsOptions, whitelist };
