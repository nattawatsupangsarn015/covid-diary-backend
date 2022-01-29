const scheduler = require("node-schedule");
const covidFunc = require("../functions/covidDiary");
const database = require("../utils/mongo");

scheduler.scheduleJob("15 * * * * *", async () => {
  console.time("using time: ");
  console.log("waiting for update .. ");
  await database();
  await Promise.all([covidFunc.importDiary(), covidFunc.importProvinces()]);
  console.log("update success !!");
  console.timeEnd("using time: ");
});
