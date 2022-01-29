const model = require("../../models/diary.model");
const importFunc = require("../../middleware/importData");

module.exports.importDiary = async () => {
  let diary = await importFunc.covidDiary();
  if (!diary || !diary.length) {
    throw { message: "data diary not found", statusCode: 404 };
  }

  diary = {
    txnDate: diary[0].txn_date || undefined,
    newCase: diary[0].new_case || undefined,
    totalCase: diary[0].total_case || undefined,
    newCaseExcludeabroad: diary[0].new_case_excludeabroad || undefined,
    totalCaseExcludeabroad: diary[0].total_case_excludeabroad || undefined,
    newDeath: diary[0].new_death || undefined,
    totalDeath: diary[0].total_death || undefined,
    newRecovered: diary[0].new_recovered || undefined,
    totalRecovered: diary[0].total_recovered || undefined,
    updateDate: diary[0].update_date || undefined,
  };

  await model.updateOne(
    { txnDate: diary.txnDate },
    { $set: { ...diary } },
    { upsert: true }
  );

  return "OK";
};

module.exports.covidDiary = async () => {
  const result = await model.findOne({
    txnDate: new Date().toJSON().slice(0, 10),
  });
  if (!result) throw { message: "data not found", statusCode: 404 };
  return result;
};
