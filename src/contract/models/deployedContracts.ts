import mongoose, { Schema } from "mongoose";

// Define Vulnerabilities Sub-schema
const vulnerabilitiesSchema = new Schema({
  critical: { type: Number },
  high: { type: Number },
  medium: { type: Number },
  low: { type: Number },
  info: { type: Number },
});

// Define Findings Sub-schema
const findingSchema = new Schema({
  id: { type: String },
  severity: { type: String },
  title: { type: String },
  description: { type: String },
  lineNumbers: { type: [Number] },
  recommendation: { type: String },
});

// Define Optimization Suggestions Sub-schema
const optimizationSuggestionSchema = new Schema({
  id: { type: String },
  description: { type: String },
  lineNumbers: { type: [Number] },
  recommendation: { type: String },
  estimatedGasSavings: { type: Number },
});

// Define Summary Sub-schema
const summarySchema = new Schema({
  vulnerabilities: { type: vulnerabilitiesSchema },
  overallScore: { type: Number },
  passedValidation: { type: Boolean },
});

// Define Details Sub-schema
const detailsSchema = new Schema({
  findings: { type: [findingSchema] },
  optimizationSuggestions: {
    type: [optimizationSuggestionSchema],
  },
});

const DeployedContractsSchema = new Schema(
  {
    userAddress: String,
    name: String,
    address: String,
    chainId: String,
    abi: String,
    contractId: String,
    constructorValues: String,
    contractName: String,
    contractCode: String,
    requestId: String,
    isPublished: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    auditReportStatus: {
      type: String,
      enum: ["not-initialized", "pending", "accepted"],
      default: "not-initialized",
    },
    isAudit: { type: Boolean, default: false },

    results: {
      summary: { type: summarySchema },
      details: { type: detailsSchema },
      reportUrl: "string",
    },

    auditReportDate: String,
  },
  {
    timestamps: true,
  }
);

const DeployedContracts = mongoose.model(
  "deployedContracts",
  DeployedContractsSchema
);

export default DeployedContracts;
