const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const covidProvinces = new Schema(
  {
    txnDate: { type: String, required: true },
    province: { type: String, required: true },
    newCase: { type: Number, default: 0 },
    totalCase: { type: Number, default: 0 },
    newCaseExcludeabroad: { type: Number, default: 0 },
    totalCaseExcludeabroad: { type: Number, default: 0 },
    newDeath: { type: Number, default: 0 },
    totalDeath: { type: Number, default: 0 },
    updateDate: { type: Date },
  },
  {
    strict: true,
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("covid-provinces", covidProvinces);
