const express = require("express");
const apiRouter = express.Router();
const artistsRouter = require("./artists.js");
const seriesRouter = require("./series.js");

// attach routers and route corrsponding route handlers
apiRouter.use("/artists", artistsRouter);
apiRouter.use("/series", seriesRouter);

module.exports = apiRouter;
