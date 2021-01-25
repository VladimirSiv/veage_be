require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authConfig = require("./config/auth.config");
const db = require("./models");
const { errorHandler, loggingHandler } = require("./handlers");
const app = express();

// Middlewares
app.use(cookieParser(authConfig.cookie_secret));
app.use(bodyParser.json({ limit: "9mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, Content-Type, Accept"
  );
  next();
});

// Routes
require("./routes/auth")(app);
require("./routes/activity")(app);
require("./routes/project")(app);
require("./routes/user")(app);
require("./routes/overview")(app);
require("./routes/team")(app);
require("./routes/stats")(app);
require("./routes/type")(app);

// Handlers
app.use(loggingHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  db.sequelize.sync();
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
