const axios = require("axios");

module.exports.covidDiary = async () => {
  return await axios.get(process.env.COVID_SUMMARY_API).then((res) => res.data);
};
