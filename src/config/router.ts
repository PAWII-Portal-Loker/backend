import express from "express";

class Router {
  app: express.Application;
  port: number;

  constructor(port: string | number) {
    this.app = express();
    this.app.use(express.json());
    this.port = Number(port);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Router;
