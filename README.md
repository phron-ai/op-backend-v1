## Project Title

OpenPhron

## Description

OpenPhron Marketplace provides a platform for users to explore various AI oracles and create smart contracts based on their ideas. The application consists of an AI Library for browsing oracles and a Workflow section for contract creation.

## Features

- **OracleList**
- **Oracle subscription**
- **Smart Contract Creation**

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/phron-ai/op-backend-v1.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   -**DBNAME** : your-db-name.

   -**MONGO_DB_URI** : your-db-base-url.

   -**OPENAI_API_KEY** : your-OPENAI_API_KEY.

   -**RPC_URL**: any RPC urls.

   -**PORT**: 9001.

   -**TOKEN_LIMIT**: daily token limit.

   -**DAY_LIMIT**: subscription period.

   -**OPENAI_ENDPOINT** : open api endpoint url.

   --**AUDIT_REPORT_URL** : audit report url.

   --**AUDIT_REPORT_CALL_BACK_URL** : webhook url for audit report.

   -**api_key**: api key for audit url.

4. Run the application:

   Start the Server

   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
