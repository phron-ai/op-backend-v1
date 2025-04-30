import mongoose, { Schema } from "mongoose";

const userAgents = new Schema(
  {
    userAddress: String,
    code: String,
    useCase: String,
    deploymentStatus: String,
    deployedUrl: String,
    contractAddress: String,
  },
  {
    timestamps: true,
  }
);

const UserAgents = mongoose.model("userAgents", userAgents);

export default UserAgents;
