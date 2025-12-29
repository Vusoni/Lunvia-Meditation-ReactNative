import { Client, Databases, Models } from "react-native-appwrite";

if (!process.env.EXPO_PUBLIC_APPWRITE_APP_ID) {
  throw new Error("EXPO_PUBLIC_APPWRITE_APP_ID is not set");
}

const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_APP_ID;
const BUNDLE_ID = "com.anonymous.Lunvia-Meditation";
const DB_ID = "69528c7b003e62ab632e";
const SESSTION_COLLECTION_ID = "session";

// Appwrite config
const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  proejctId: PROJECT_ID,
  platform: BUNDLE_ID,
  db: DB_ID,
  tables: {
    session: SESSTION_COLLECTION_ID,
  },
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.proejctId)
  .setPlatform(appwriteConfig.platform);

const database = new Databases(client);
export { appwriteConfig, client, database };

// Type Safety

export interface Session extends Models.Document {
  user_id: string;
  status: "in-progress";
  conv_id: string;
  tokens?: number;
  call_duration_secs?: number;
  transcript?: string;
  call_summary_title?: string;
}
