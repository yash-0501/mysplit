import { connect } from "mongoose";

async function connectMongoDb(uri: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    connect(uri)
      .then(() => {
        console.log("Connected to MongoDB");
        resolve();
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        reject(error);
      });
  });
}

export { connectMongoDb };
