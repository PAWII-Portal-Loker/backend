import mongoose from "mongoose";

class Database {
  private dbInstance: mongoose.Connection;

  constructor(dbConfig: DatabaseConstructor) {
    mongoose.connect(
      `mongodb://${dbConfig.dbHost}:${dbConfig.dbPort}/${dbConfig.dbName}`,
      {
        user: dbConfig.dbUser,
        pass: dbConfig.dbPassword,
      },
    );
    this.dbInstance = mongoose.connection;
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
  dbUser: string;
  dbPassword: string;
  dbName: string;
};

export type { DatabaseConstructor };
export default Database;
