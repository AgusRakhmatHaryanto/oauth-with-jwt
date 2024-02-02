const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const app = express();
require('./middleware/database')
const api = process.env.API;
const port = process.env.PORT;
require('./middleware/passport')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));


const session = require("express-session");
require("dotenv").config();
const passport = require("passport");
const indexRouter = require("./routers/indexRouter");


app.use(
  session({
    secret: process.env.SECRET_KEY_OAUTH,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(indexRouter);




app.listen(port, () =>
  console.log(
    `Server running on port ${port}
  http://localhost:${port}/${api}`
  )
);
