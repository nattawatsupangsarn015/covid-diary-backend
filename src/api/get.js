const express = require("express");
const router = express.Router();
const func = require("../functions/covidDiary");

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

router.get("/diary", async (req, res, next) => {
  try {
    const result = await func.covidDiary();
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

router.get("/by-provinces", async (req, res, next) => {
  try {
    const { date } = req.query;
    const result = await func.covidProvinces(date);
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

// 

// Error handler
router.use((err, req, res, next) => {
  console.log({ err });
  res
    .status(err.statusCode ? err.statusCode : 500)
    .send(err.message)
    .end();
});

module.exports = router;
