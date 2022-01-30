const scheduler = require("node-schedule");
const covidFunc = require("../functions/covidDiary");
const database = require("../utils/mongo");

scheduler.scheduleJob("* * 3 * * *", async () => {
  console.time("using time: ");
  console.log("waiting for update .. ");
  if (process.env.NODE_ENV !== "local") {
    await database();
    await Promise.all([covidFunc.importDiary(), covidFunc.importProvinces()]);
  } else {
    console.log("STATE LOCAL");
  }
  console.log("update success !!");
  console.timeEnd("using time: ");
});
