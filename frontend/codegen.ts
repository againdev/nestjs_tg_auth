import { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";

dotenv.config();

const config: CodegenConfig = {
  schema:
    process.env.NEXT_PUBLIC_GRAPHQL_SERVER_ENDPOINT ||
    "http://localhost:3000/graphql",
  documents: ["src/graphql/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      plugins: ["typescript"],
    },
  },
};

export default config;
