const express = require("express");
const router = express();
const cors = require("cors");
const PORT = process.env.PORT || 5000;

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.options("*", cors({ credentials: true, origin: true }));
router.use(cors({ origin: true, credentials: true }));

router.use("/covid-diary", require("./api/get"));
router.use("/covid-diary", require("./api/put"));
router.use("/covid-diary", require("./api/post"));
router.use("/covid-diary", require("./api/delete"));

router.listen(PORT, () => {
  console.log("Start server with port : " + PORT);
});

module.exports = router;
