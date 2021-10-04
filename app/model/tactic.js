const extendSchema = require("mongoose-extend-schema");
const commonModel = require("./commonModel");
const mongooseService = require("../services/core/mongoose-service");
const env = require("../config/env");
let mongoose = require("mongoose");

const tacticSchema = extendSchema(
  commonModel.schema,
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    techniques: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Technique",
      },
    ],
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);
module.exports = mongooseService.newModel("Tactic", tacticSchema);
