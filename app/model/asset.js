const extendSchema = require("mongoose-extend-schema");
const commonModel = require("./commonModel");
const mongooseService = require("../services/core/mongoose-service");
const env = require("../config/env");
let mongoose = require("mongoose");
const assetSchema = extendSchema(
  commonModel.schema,
  {
    name: {
      type: String,
    },
    assetType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetType",
      required: true,
    },
    criticality: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    mtd: {
      type: Number,
      min: 1,
      required: true,
    },
    rto: {
      type: Number,
      min: 1,
      required: true,
    },
    userResponsible: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
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
module.exports = mongooseService.newModel("Asset", assetSchema);
