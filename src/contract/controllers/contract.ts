import { Request } from "express";
import userContractService from "../services/userContract";
import axios from "axios";
import { access } from "fs";
import { execSync } from "child_process";
import fs from "fs";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv/config";
import { UserAgents, ContractUseCases, DeployedContracts } from "../models";

const contractController = {
  sendInitMessage: async (req: any, res: any): Promise<void> => {
    try {
      const userAddress = req.user;
      const { initMessage, chatMode } = req.body;
      const userContract = await userContractService.create({
        userAddress,
        initMessage,
        chatMode,
      });
      res.json(userContract);
    } catch (error: any) {
      console.log("sendInitMessage-error: ", error.message);
      res.json(error.message);
    }
  },
  sendMessage: async (req: any, res: any): Promise<void> => {
    try {
      const userAddress = req.user;
      const { _id, stepId, content } = req.body;
      const response = await userContractService.addMessage({
        _id,
        stepId,
        content,
        userAddress,
      });
      res.json(response);
    } catch (error: any) {
      console.log("send-message-error: ", error.message);
      res.json(error.message);
    }
  },
  getContracts: async (req: any, res: any): Promise<void> => {
    try {
      const userAddress = req.user;
      const contracts = await userContractService.getContractsByUser(
        userAddress
      );
      res.json(contracts);
    } catch (error: any) {
      console.log("get-contract-error: ", error.message);
    }
  },
  shareContract: async (req: any, res: any): Promise<void> => {
    try {
      const { id, isPublic } = req.body;
      const result = await userContractService.shareContract({
        _id: id,
        isPublic,
      });
      res.json(result);
    } catch (error: any) {
      res.json(error.message);
      console.log("share-contract-error: ", error.message);
    }
  },
  getSharedContract: async (req: any, res: any): Promise<void> => {
    try {
      const { access_token } = req.params;
      const result = await userContractService.getSharedContract(access_token);
      res.json(result);
    } catch (error: any) {
      res.json(error.message);
      console.log("get-shared-contracts-error: ", error.message);
    }
  },
  saveResult: async (req: any, res: any): Promise<void> => {
    try {
      const { _id, stepId } = req.body;

      const result = await userContractService.saveResult({ _id, stepId });
      res.json(result);
    } catch (error: any) {
      res.json(error.message);
      console.log("save-result-error: ", error.message);
    }
  },
  deleteContract: async (req: any, res: any): Promise<void> => {
    try {
      const { _id }: { _id: string } = req.params;
      await userContractService.deleteContractById({ _id });
      res.json({ res: "success" });
    } catch (error: any) {
      console.log("delete-contract-error", error.message);
    }
  },
  saveError: async (req: any, res: any): Promise<void> => {
    try {
      const { contractId, error } = req.body;
      await userContractService.saveError({ contractId, error });
      res.json({ res: "success" });
    } catch (error: any) {
      console.log("save-error-error", error.message);
      res.json(error.message);
    }
  },
  renameContract: async (req: any, res: any) => {
    try {
      const { name, contract_Id } = req.body;
      await userContractService.renameContractById({ name, _id: contract_Id });
      res.json({ res: "success" });
    } catch (error: any) {
      console.log("rename-contract-error: ", error.message);
    }
  },
  addSharedContract: async (req: any, res: any) => {
    try {
      const { _id, address } = req.body;
      await userContractService.addSharedContract({ _id, address });
      res.json({ res: "success" });
    } catch (error: any) {
      console.log("add-shared-contract-error: ", error.message);
    }
  },
  addDeployedContracts: async (req: any, res: any): Promise<void> => {
    try {
      const userAddress = req.user;
      const {
        contractAddress,
        name,
        chainId,
        abi,
        contractId,
        constructorValues,
        contractName,
        contractCode,
      } = req.body;

      console.log("body", req.body);
      const userContract = await userContractService.addDeployedContract({
        userAddress,
        name,
        address: contractAddress,
        chainId,
        abi: JSON.stringify(abi),
        contractId,
        contractCode,
        contractName,
        constructorValues: JSON.stringify(constructorValues),
      });
      res.json(userContract);
    } catch (error: any) {
      console.log("sendInitMessage-error: ", error.message);
      res.json(error.message);
    }
  },
  updateDeployedContracts: async (req: any, res: any): Promise<void> => {
    try {
      const userAddress = req.user;
      const { address, isVerified, name } = req.body;

      console.log("body", req.body);
      const userContract = await userContractService.updateDeployedContract({
        address,
        isVerified,
        name,
      });
      res.json(userContract);
    } catch (error: any) {
      console.log("sendInitMessage-error: ", error.message);
      res.json(error.message);
    }
  },
  getDeployedContracts: async (req: any, res: any): Promise<void> => {
    try {
      const { limit, page } = req.query;
      const contracts = await userContractService.getDeployedContracts({
        limit,
        page,
      });
      res.json(contracts);
    } catch (error: any) {
      console.log("get-contract-error: ", error.message);
    }
  },
  getUserDeployedContracts: async (req: any, res: any): Promise<void> => {
    try {
      const { id } = req.params;

      const userDeployedContract =
        await userContractService.getUserDeployedContract(id);

      const contractsData = userDeployedContract.map((d: any) => {
        return {
          userAddress: d.userAddress,
          address: d.address,
          chainId: d.chainId,
          //@ts-ignore
          abi: JSON.parse(d?.abi),
          contractId: d.contractId,
        };
      });

      // [
      //   {
      //     userAddress: userDeployedContract.userAddress,
      //     address: userDeployedContract.address,
      //     chainId: userDeployedContract.chainId,
      //     abi: JSON.parse(userDeployedContract.abi),
      //     contractId: userDeployedContract.contractId,
      //   },
      // ]
      res.json(contractsData);
    } catch (error: any) {
      console.log("getUserDeployedContracts: ", error.message);
    }
  },
  verifyContract: async (req: any, res: any): Promise<void> => {
    try {
      const { contractCode, abi, address } = req.body;

      console.log({
        address,
      });

      execSync(`npx hardhat verify --network arbitrum-sepolia ${address}`, {
        encoding: "utf-8",
        stdio: "pipe",
      });

      res.status(201).json({
        message: "success",
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },
  agentSuggester: async (req: any, res: any): Promise<void> => {
    try {
      const { contractCode, contractAddress, userAddress } = req.body;

      const useCases = await ContractUseCases.findOne({
        contractAddress: contractAddress,
        userAddress: userAddress,
      });

      if (useCases) {
        res.status(200).json({
          success: true,
          use_cases: useCases.useCases,
        });
        return;
      }

      const prompt = `Act as a Web3.0 expert agent. Analyze the following smart contract code and suggest the best possible use cases (min 3 and maximum can be any) in a structured JSON format. Include a title, description, potential users, and relevant industries.
    
        Smart Contract Code:
        ${contractCode}
        
        JSON Format:
        {
          "use_cases": [
            {
              "title": "",
              "description": "",
              "potential_users": [""],
              "industries": [""]
            }
          ]
        }`;

      const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT;
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

      if (!OPENAI_ENDPOINT || !OPENAI_API_KEY) {
        return res.status(400).json({
          success: false,
          message: "No OpenAI endpoint or API key found",
        });
      }

      const response = await axios.post(
        OPENAI_ENDPOINT,
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a Web3.0 smart contract expert.",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const aiResponseText = response.data.choices[0].message.content;

      let parsedResponse = { use_cases: [] };

      try {
        parsedResponse = JSON.parse(aiResponseText);
      } catch (error) {
        const response = await axios.post(
          OPENAI_ENDPOINT,
          {
            model: "gpt-4",
            messages: [
              {
                role: "system",
                content: "You are a Web3.0 smart contract expert.",
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
        const aiResponseText = response.data.choices[0].message.content;
        parsedResponse = JSON.parse(aiResponseText);
      }

      // save use cases in db
      await ContractUseCases.create({
        contractAddress: contractAddress,
        useCases: parsedResponse.use_cases,
        userAddress: userAddress,
      });

      res.status(201).json({
        success: true,
        ...parsedResponse,
      });
    } catch (error) {
      res.status(400).json(error);
      console.log("error", error);
    }
  },
  createAiAgent: async (req: any, res: any): Promise<void> => {
    try {
      const { use_case, deployed_address, chain_id, abi, userAddress } =
        req.body;

      const createdAgent = await UserAgents.findOne({
        contractAddress: deployed_address,
        userAddress,
      });

      if (createdAgent) {
        res.status(201).json({
          success: true,
          generatedCode: createdAgent.code ? JSON.parse(createdAgent.code) : {},
          _id: createdAgent._id,
        });

        return;
      }

      const userData = {
        abi: abi,
        contract_address: deployed_address,
        chain_id: chain_id,
        use_case: use_case,
      };

      const promptJson = {
        task: "Generate a fully functional AI agent that interacts with the given smart contract, dynamically structures directories, provides full API documentation and deployment instructions, and includes a user-friendly UI for interaction and configuration.",
        description:
          "You must generate a **fully working AI agent** based on the provided use case. The AI agent should handle smart contract interactions, include API endpoints, be deployable with minimal modifications, and provide a UI interface for seamless user interaction and configuration.",
        use_case: userData.use_case,
        smart_contract: {
          contract_abi: JSON.stringify(userData.abi),
          contract_address: userData.contract_address,
          chain_id: userData.chain_id,
        },
        priority: [
          "**1️ Generate AI Agent Code Based on Use Case**",
          "**2️ Generate API Endpoints for Interacting with Smart Contract**",
          "**3️ Provide Configuration Files**",
          "**4️ Create a User-Friendly UI to Interact with the API**",
          "**5️ Create a Detailed Project Report (DPR)**",
          "**6️ Provide Usage & Deployment Instructions**",
          "**7️ Package.json file for the libraries it is using so that we can run 'npm install'**",
        ],
        guidelines: [
          "💡 **The AI agent must be tailored for the provided use case.**",
          "💡 **It should include API endpoints using Node.js (Express.js) or Python (Flask/FastAPI).**",
          "💡 **The AI agent should generate dynamic responses based on smart contract interactions.**",
          "💡 **Configuration settings must be stored in environment variables or config files.**",
          "💡 **The AI agent should provide complete error handling and logging.**",
          "💡 **Ensure all output is returned in a valid JSON format.**",
          "💡 **The UI should provide a form where users can input contract details, API configurations, and interact with endpoints.**",
          "💡 **Use React.js or Vue.js for the UI, ensuring it dynamically fetches data from the API.**",
        ],
        expected_output: {
          response_format:
            "Valid JSON object where **directories are structured dynamically**. Each key represents a filename, and the value contains the file's full content. The JSON **must include all code files, API definitions, UI components, and the DPR**.",
          code_structure: [
            "📂 **Root Directory:**",
            "├── 📁 config → Holds `config.json`, `contractABI.json`, and `.env` (including OpenAI API key)",
            "├── 📁 src → Contains AI agent logic (`agent.js`) with OpenAI integration",
            "├── 📁 api → API endpoints (`api.js`) with OpenAI-powered endpoints",
            "├── 📁 tests → Test scripts (`test_agent.js`) including OpenAI tests",
            "├── 📁 public → Static files for the UI (HTML, CSS, JS)",
            "│   ├── 📁 css → CSS files for styling",
            "│   ├── 📁 js → JavaScript files for interactivity",
            "│   └── 📜 index.html → Main HTML file for the UI",
            "├── 📁 docs → Detailed Project Report (`DPR.md`) including OpenAI usage",
            "└── 📜 README.md → Setup and usage instructions, including OpenAI setup and how to run the app using `npm run start`.",
          ],
        },
      };

      const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT;
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

      if (!OPENAI_ENDPOINT || !OPENAI_API_KEY) {
        return res.status(400).json({
          success: false,
          message: "No OpenAI endpoint or API key found",
        });
      }

      console.log("🔄 Requesting AI Agent Generation from OpenAI...");

      // Send POST request to OpenAI API
      const response = await axios.post(
        OPENAI_ENDPOINT,
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert AI agent Developer with Web3 expertise. Assume the user has no technical knowledge and perform all steps independently. Return only a valid JSON object with no extra text.",
            },
            { role: "user", content: JSON.stringify(promptJson) },
          ],
          temperature: 0.7, // Adjust for randomness (0.7 is balanced)
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      // Extract AI-generated content
      const generatedCodeContent =
        response.data.choices[0].message.content.trim();

      // Validate response
      if (!generatedCodeContent) {
        console.error(
          "❌ Error: OpenAI returned an empty response. Possible API rate limit or timeout."
        );
        return;
      }

      // Parse JSON response
      let generatedCodeJson;
      try {
        generatedCodeJson = JSON.parse(generatedCodeContent);

        // // Save to file
        fs.writeFileSync(
          "generated_ai_agent.json",
          JSON.stringify(generatedCodeJson, null, 4)
        );
        // console.log("\n📂 Saved JSON to 'generated_ai_agent.json'");
      } catch (jsonError: any) {
        console.error("\n⚠️ ERROR: Failed to parse JSON response.");
        console.error("Reason:", jsonError.message);
        console.error(
          "\n🔍 Debugging: Printing raw response for inspection ⬇️\n"
        );
        console.error(generatedCodeContent);
      }

      // const reviewedCode = await contractController.reviewAndImproveAgent(
      //   generatedCodeJson,
      //   userData
      // );

      generatedCodeJson["Root Directory"]["config"][
        "contractABI.json"
      ] = `${JSON.stringify(userData.abi)}`;

      const agent = await UserAgents.create({
        code: JSON.stringify(generatedCodeJson),
        deployedUrl: null,
        deploymentStatus: "waiting",
        useCase: use_case,
        userAddress: userAddress,
        contractAddress: userData.contract_address,
      });

      res.status(201).json({
        success: true,
        generatedCode: generatedCodeJson,
        _id: agent._id,
      });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
      console.log("error", error.message);
    }
  },
  reviewAndImproveAgent: async (generatedCodeJson: any, user_data: any) => {
    try {
      const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT;
      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

      if (!OPENAI_ENDPOINT || !OPENAI_API_KEY) {
        throw new Error("No OpenAI endpoint or API key found");
      }

      const reviewPrompt = {
        task: "Review and improve the generated AI agent for correctness, security, completeness, and enhance the frontend for API interaction and configuration.",
        description:
          "Analyze the AI agent for potential issues and ensure it adheres to best practices. Provide necessary improvements, including fixing API interactions, optimizing smart contract calls, enhancing security, and refining the frontend for seamless user interaction and configuration.",
        guidelines: [
          "✅ **Check if the AI agent correctly implements the provided use case.**",
          "✅ **Verify API endpoints interact correctly with the smart contract and return expected responses.**",
          "✅ **Ensure smart contract transactions and queries are handled securely and efficiently.**",
          "✅ **Validate configuration settings, ensuring they are stored in environment variables or config files.**",
          "✅ **Check for complete exception handling and structured logging across the AI agent and API.**",
          "✅ **Enforce security best practices in API and smart contract interactions (e.g., input sanitization, access control).**",
          "✅ **Confirm all outputs adhere to proper JSON formatting and are structured dynamically.**",
          "✅ **Optimize AI agent logic, eliminating redundant or inefficient code.**",
          "✅ **Verify the frontend directory includes a UI for interacting with the API and configuring settings.**",
          "✅ **Ensure the UI dynamically fetches data from the API and correctly displays contract interactions.**",
          "✅ **Check if UI components correctly handle user inputs, including contract details and API configurations.**",
          "✅ **Confirm that all UI elements (buttons, forms, and status indicators) function as expected.**",
          "✅ **Ensure `package.json` includes all necessary dependencies for both backend and frontend.**",
          "✅ **Make sure to use the variables Mentioned below to use where required.**",
        ],
        Variables: {
          contract_address: user_data["deployed_address"],
          chain_id: user_data["chain_id"],
        },
        expected_improvements: {
          code_quality:
            "Ensure the AI agent code follows best practices for maintainability, readability, and efficiency.",
          api_security:
            "Strengthen API security by adding proper authentication, input validation, and error handling.",
          smart_contract_handling:
            "Optimize smart contract interactions to reduce gas costs and handle errors effectively.",
          configuration_management:
            "Ensure environment variables and config files are used properly for settings and secrets.",
          ui_functionality:
            "Improve the UI for seamless interaction with the AI agent's API, ensuring real-time updates and proper error messages.",
          "API Documentation": "Provide complete extensive API Documentation.",
          Readme_File:
            "Create Readme file in which all deployment steps should be written *no github cloning as this code is using locally.",
        },
        expected_output: {
          response_format:
            "Valid JSON object where **directories are structured dynamically**. Each key represents a filename, and the value contains the file's full content. The JSON **must include all code files, API definitions, UI components, and the DPR**.",

          code_structure: [
            "📂 **Root Directory:**",
            "├── 📁 config/ → Holds `config.json`, `contractABI.json`, and `.env`",
            "├── 📁 src/ → Contains AI agent logic (`agent.py` or `agent.js`)",
            "├── 📁 api/ → API endpoints (`api.py` or `api.js`)",
            "├── 📁 tests/ → Test scripts (`test_agent.py` or `test_agent.js`)",
            "├── 📁 ui/ → Frontend UI (`index.jsx` or `index.vue` along with components/ folder)",
            "├── 📁 docs/ → Detailed Project Report (`DPR.md`)",
            "└── 📜 README.md → Setup and usage instructions",
          ],
        },
        generated_code: generatedCodeJson,
      };

      const response = await axios.post(
        OPENAI_ENDPOINT,
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an expert AI agent reviewer with Web3 expertise. Identify issues in the AI agent and suggest improvements. Return only a complete JSON object with the reviewed document, improved code, and make sure to return the complete JSON, preserving unaffected files.",
            },
            { role: "user", content: JSON.stringify(reviewPrompt) },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      let reviewedCode = null;
      let parsing = true;

      while (parsing) {
        try {
          console.log("parsing...");
          reviewedCode = JSON.parse(
            response.data.choices[0].message.content.trim()
          );
          parsing = false;
        } catch (error) {
          console.log("parsing error parsing again...");
          reviewedCode = JSON.parse(
            response.data.choices[0].message.content.trim()
          );
        }
      }

      return reviewedCode;
    } catch (error: any) {
      console.log("error", error.message);
      return { status: "error", message: error.message };
    }
  },
  updateAgentStatus: async (req: any, res: any) => {
    try {
      const { id, status } = req.body;

      await UserAgents.findByIdAndUpdate(id, {
        deploymentStatus: status,
      });

      res.status(200).json({
        success: true,
        message: "success",
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
  getDeployedContract: async (req: any, res: any) => {
    try {
      const { id } = req.params;

      const contract = await DeployedContracts.findOne({
        address: id,
      });

      res.status(200).json({
        success: true,
        contract,
      });
    } catch (error: any) {
      res.status(200).json({
        success: false,
        message: error.message,
      });
    }
  },

  sendAuditReport: async (req: any, res: any): Promise<void> => {
    try {
      const { contractAddress } = req.body;

      console.log("sendAuditReport", contractAddress);
      const requestId = uuid();

      const contract = await DeployedContracts.findOne({
        address: contractAddress,
      });

      console.log("contract", `${process.env.AUDIT_REPORT_URL}`);
      await DeployedContracts.findOneAndUpdate(
        { address: contractAddress },
        { requestId: requestId }
      );

      console.log("resp", contract);

      const resp = await axios.post(
        `${process.env.AUDIT_REPORT_URL}`,
        {
          requestId: requestId,
          contractData: {
            name: contract?.contractName,
            sourceCode: contract?.contractCode,
            language: "solidity",
            compiler: "0.8.16",
            optimizationEnabled: true,
            optimizationRuns: 200,
          },
          callbackUrl: process.env.AUDIT_REPORT_CALL_BACK_URL,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.api_key}`,
          },
        }
      );

      console.log("resp", resp);

      if (resp.data.data) {
        await DeployedContracts.findOneAndUpdate(
          { address: contractAddress },
          { requestId: requestId, auditReportStatus: "pending" }
        );
      }

      console.log("resp", resp);

      res.json({ success: true, message: "sent successfully" });
    } catch (error: any) {
      console.log("sendInitMessage-error: ", error.message);
      res.json(error.message);
    }
  },
  updateAuditReportStatus: async (req: any, res: any): Promise<void> => {
    try {
      const { requestId, status, results, completedAt } = req.body;

      console.log("body", req.body);
      const userContract = await DeployedContracts.findOneAndUpdate(
        { requestId },
        {
          auditReportStatus: status,
          results,
          auditReportDate: completedAt,
        }
      );
      res.json(userContract);
    } catch (error: any) {
      console.log("sendInitMessage-error: ", error.message);
      res.json(error.message);
    }
  },
};

export default contractController;
