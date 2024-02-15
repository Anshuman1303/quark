const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const { corsOptions } = require("./config/corsOptions");
const PORT = process.env.PORT || 3500;
const rateLimiter = require("./middleware/rateLimiter");
const appRoute = require("./routes/app");
const authRoute = require("./routes/auth");
const apiRoute = require("./routes/api");
const credentials = require("./middleware/credentials");
var session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { options, pool } = require("./config/mySQL");
const verifyUser = require("./middleware/verifyUser");
require("dotenv").config();
app.disable("x-powered-by");
app.use(rateLimiter);
// app.use(helmet());
app.use(credentials);
app.use(cors(corsOptions));

const sessionStore = new MySQLStore(options, pool);

app.use(
  session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    // store: sessionStore,
    // cookie: {
    //   secure: false,
    //   maxAge: 30 * 24 * 60 * 60 * 1000,
    // },
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// LOG EVENTS
app.use(require("./middleware/logger").logEvent);

app.use(authRoute);
app.use("/api", apiRoute);
app.use(express.static(path.join(__dirname, "public")));
app.use(appRoute);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
