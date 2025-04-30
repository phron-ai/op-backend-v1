import BaseDataAccess from "./baseDataAccess";
import {
  UserContracts,
  UserToken,
  Workflows,
  SharedContracts,
} from "../models";
import UserContractDA from "./userContractDA";
import CostDA from "./costDA";
import DeployedContractsDA from "./deployedContractsDA";
import DeployedContracts from "../models/deployedContracts";
import AdminAddressDA from "./adminAddress";
import AdminAddress from "../models/adminAddress";
import UserAgents from "../models/userAgents";
import UserAgentsDA from "./userAgentsDA";

const workflowsDA = new BaseDataAccess(Workflows);
const userContractsDA = new UserContractDA(UserContracts);
const costDA = new CostDA(UserToken);
const shareContractsDA = new BaseDataAccess(SharedContracts);
const deployedContractsDA = new DeployedContractsDA(DeployedContracts);
const adminAddressDA = new AdminAddressDA(AdminAddress);
const userAgentsDA = new UserAgentsDA(UserAgents);

export {
  workflowsDA,
  userContractsDA,
  costDA,
  shareContractsDA,
  deployedContractsDA,
  adminAddressDA,
  userAgentsDA,
};
