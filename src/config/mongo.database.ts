import mongoose from "mongoose";

class MongoDatabase {
  private dbInstance: mongoose.Connection;

  constructor(dbConfig: DatabaseConstructor) {
    mongoose.connect(
      `mongodb://${dbConfig.dbHost}:${dbConfig.dbPort}/${dbConfig.dbName}`,
      {},
    );
    this.dbInstance = mongoose.connection;

    this.dbInstance.on("connected", () => {
      console.log("Connected to MongoDB");
    });

    this.dbInstance.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  }

  public getDbInstance(): mongoose.Connection {
    return this.dbInstance;
  }

  public async close(): Promise<void> {
    await mongoose.disconnect();
  }
}

type DatabaseConstructor = {
  dbHost: string;
  dbPort: number;
  dbName: string;
};

export type { DatabaseConstructor };
export default MongoDatabase;
