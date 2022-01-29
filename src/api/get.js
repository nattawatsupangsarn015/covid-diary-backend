const express = require("express");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res.status(200).send(":)").end();
  } catch (err) {
    next(err);
  }
});

router.get("/healthcheck", async (req, res, next) => {
  try {
    const healthcheck = {
      path: "GET",
      uptime: process.uptime(),
      message: "OK",
      timestamp: Date.now(),
    };
    res.status(200).send(healthcheck).end();
  } catch (err) {
    next(err);
  }
});

// Error handler
router.use((err, req, res, next) => {
  console.log({ err });
  res
    .status(err.statusCode ? err.statusCode : 500)
    .send(err.message)
    .end();
});

module.exports = router;
