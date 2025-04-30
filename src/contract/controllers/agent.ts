import UserAgents from "../models/userAgents";
import { DeployedContracts } from "../models";
import { Request, Response } from "express";

const agentsController = {
  // Get all user agents
  getAllAgents: async (req: Request, res: Response): Promise<any> => {
    try {
      const agents = await UserAgents.find();

      res.status(200).json({
        success: true,
        agents,
      });
    } catch (error: any) {
      console.error("Error fetching agents:", error);
      return res.status(500).json({ message: error.message });
    }
  },

  changeAgentStatus: async (req: Request, res: Response): Promise<any> => {
    try {
      const { status } = req.body;

      await UserAgents.find({
        deploymentStatus: status,
      });

      res.status(200).json({
        success: true,
        message: "deployment status updated!",
      });
    } catch (error: any) {
      console.error("changeAgentStatus agents:", error);
      return res.status(500).json({ message: error.message });
    }
  },

  createPublishedAgents: async (req: Request, res: Response): Promise<any> => {
    try {
      const { isPublished, address } = req.body;

      await DeployedContracts.findOneAndUpdate(
        {
          address: address,
        },
        { isPublished }
      );

      res.status(200).json({
        success: true,
        message: "agent published successfully!",
      });
    } catch (error: any) {
      console.error("agent published:", error);
      return res.status(500).json({ message: error.message });
    }
  },
  getPublishedAgents: async (req: Request, res: Response): Promise<any> => {
    try {
      // const {  } = req.body;

      const publishedAgents = await DeployedContracts.find({
        isPublished: true,
      });

      res.status(200).json({
        data: publishedAgents,
        success: true,
        message: "deployment status updated!",
      });
    } catch (error: any) {
      console.error("changeAgentStatus agents:", error);
      return res.status(500).json({ message: error.message });
    }
  },
};

export default agentsController;
