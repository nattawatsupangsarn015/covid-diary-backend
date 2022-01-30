const diaryModel = require("../../models/diary.model");
const provincesModel = require("../../models/provinces.model");
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

  await diaryModel.updateOne(
    { txnDate: diary.txnDate },
    { $set: { ...diary } },
    { upsert: true }
  );

  return "OK";
};

module.exports.importProvinces = async () => {
  let provinces = await importFunc.covidProvinces();
  if (!provinces || !provinces.length) {
    throw { message: "data provinces not found", statusCode: 404 };
  }

  const [totalLvNewCase, totalLvCase, totalLvNewDeath, totalLvDeath] = [
    provinces.reduce((sum, pro) => sum + parseInt(pro.new_case), 0) /
      provinces.length,
    provinces.reduce((sum, pro) => sum + parseInt(pro.total_case), 0) /
      provinces.length,
    provinces.reduce((sum, pro) => sum + parseInt(pro.new_death), 0) /
      provinces.length,
    provinces.reduce((sum, pro) => sum + parseInt(pro.total_death), 0) /
      provinces.length,
  ];

  provinces = provinces.map((province) => {
    const convertProvinces = {
      txnDate: province.txn_date,
      province: province.province,
      newCase: province.new_case,
      totalCase: province.total_case,
      newCaseExcludeabroad: province.new_case_excludeabroad,
      totalCaseExcludeabroad: province.total_case_excludeabroad,
      newDeath: province.new_death,
      totalDeath: province.total_death,
      levelNewCase: this.calculateRisk(totalLvNewCase, province.new_case),
      levelTotalCase: this.calculateRisk(totalLvCase, province.total_case),
      levelNewDeath: this.calculateRisk(totalLvNewDeath, province.new_death),
      levelTotalDeath: this.calculateRisk(totalLvDeath, province.total_death),
      updateDate: province.update_date,
    };

    return provincesModel.updateOne(
      {
        txnDate: convertProvinces.txnDate,
        province: convertProvinces.province,
      },
      { $set: { ...convertProvinces } },
      { upsert: true }
    );
  });

  await Promise.all(provinces);

  return "OK";
};

module.exports.covidDiary = async () => {
  const result = await diaryModel.findOne({
    txnDate: new Date().toJSON().slice(0, 10),
  });
  if (!result) throw { message: "data not found", statusCode: 404 };
  return result;
};

module.exports.covidProvinces = async (date) => {
  if (!this.isValidDate(new Date(date))) {
    throw { message: "wrong type date", statusCode: 400 };
  }

  const result = await provincesModel.find({
    txnDate: new Date(date).toJSON().slice(0, 10),
  });

  if (!result || !result.length) {
    throw { message: "data not found", statusCode: 404 };
  }

  return result;
};

module.exports.calculateRisk = (avg, score) => {
  const indicator = avg / 3;
  switch (true) {
    case score >= avg + indicator:
      return "high";
    case score < avg + indicator && score >= avg - indicator:
      return "medium";
    default:
      return "low";
  }
};

module.exports.isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};
