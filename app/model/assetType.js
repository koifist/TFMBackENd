const extendSchema = require("mongoose-extend-schema");
const commonModel = require("./commonModel");
const mongooseService = require("../services/core/mongoose-service");
const env = require("../config/env");

const assetTypeSchema = extendSchema(
  commonModel.schema,
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
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
module.exports = mongooseService.newModel("AssetType", assetTypeSchema);
