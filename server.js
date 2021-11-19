const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("errorhandler");
const morgan = require("morgan");
const apiRouter = require("./api/api");

// initiate an express app
const app = express();

// use environment PORT or 3001 if not set
const PORT = process.env.PORT || 3001;

// apply middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));

// attach default router and apply errorhandler middleware to handle errors
app.use("/api", apiRouter);
app.use(errorHandler());

// start the app on defined PORT
app.listen(PORT, console.log(`Listening on ${PORT}`));

module.exports = app;
