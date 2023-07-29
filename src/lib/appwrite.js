import { Client, Storage, ID, Databases, Query } from "appwrite";
import cryptoRandomString from "crypto-random-string";

const client = new Client();
const AW_ENDPOINT = "https://cloud.appwrite.io/v1";
const PROJECT_ID = "64c515ef9dc99d7e4ba4";
const BUCKET_ID = "64c516e6b5846f2559a3";
const DATABASE_ID = "64c5473852995df95249";
const COLLECTION_ID = "64c54760c30fae59dbdf";

client.setEndpoint(AW_ENDPOINT).setProject(PROJECT_ID);

const storage = new Storage(client);
const databases = new Databases(client);

const uploadFile = async (file) => {
  const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
  const viewUrl = await storage.getFileView(BUCKET_ID, response.$id);
  const shortUrl = cryptoRandomString({ length: 10, type: "url-safe" });
  await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
    shortUrl: shortUrl,
    imgUrl: viewUrl,
  });
  return shortUrl;
};

const getFile = async (shortUrl) => {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("shortUrl", shortUrl),
  ]);
  return response.documents[0].imgUrl;
};

export { uploadFile, getFile };
