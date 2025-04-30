import mongoose, { Schema } from "mongoose";

const contractUseCases = new Schema(
  {
    userAddress: String,
    useCases: [
      {
        title: String,
        description: String,
        potential_users: [String],
        industries: [String],
      },
    ],
    contractAddress: String,
    code: String,
    deploymentStatus: String,
    deployedUrl: String,
  },
  {
    timestamps: true,
  }
);

const ContractUseCases = mongoose.model("contractUseCases", contractUseCases);

export default ContractUseCases;
