const express = require("express");
const router = express.Router();
const func = require("../functions/covidDiary");

router.post("/import/covid-diary", async (req, res, next) => {
  try {
    const result = await func.importDiary();
    res.status(200).send(result).end();
  } catch (err) {
    next(err);
  }
});

router.post("/import/covid-provinces", async (req, res, next) => {
  try {
    const result = await func.importProvinces();
    res.status(200).send(result).end();
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
