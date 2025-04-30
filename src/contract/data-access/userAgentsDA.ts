import BaseDataAccess from "./baseDataAccess";

class UserAgentsDA extends BaseDataAccess {
  constructor(dbModel: any) {
    super(dbModel);
  }

  async countContracts(filter: any): Promise<any> {
    const totalUserAgents = await this.countDocuments(filter ? filter : {});

    return totalUserAgents;
  }
}

export default UserAgentsDA;
