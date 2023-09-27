import express from "express";
import * as fs from "fs";
import { Bulletin } from "./interfaces";
import { DataConsolidator } from "./dataConsolidator";

export class BulletinServer {
  app: express.Application;
  private server: any;
  jsonFilePath: string;

  constructor(jsonFilePath: string) {
    this.app = express();
    this.jsonFilePath = jsonFilePath;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(express.json());
  }

  private setupRoutes() {
    this.app.post("/addBulletin", this.addBulletin.bind(this));
    this.app.get("/getBulletin", this.getBulletin.bind(this));
    this.app.delete("/deleteBulletin/:id", this.deleteBulletin.bind(this));
  }

  private async addBulletin(req: express.Request, res: express.Response) {
    try {
      const existingData = DataConsolidator.checkJsonFile(
        this.jsonFilePath
      ) || { bulletins: [] };

      const newBulletin = {
        id: req.body.id,
        title: req.body.title,
        userName: req.body.userName,
        body: req.body.body,
        geo: req.body.geo,
        imageUrl: req.body.imageUrl,
      };

      existingData.bulletins.unshift(newBulletin);

      fs.writeFileSync(
        this.jsonFilePath,
        JSON.stringify(existingData, null, 2)
      );
      console.debug(`Bulletin id: ${newBulletin.id} added successfully`);
      res.json({
        message: "Bulletin added successfully",
        bulletin: newBulletin,
      });
    } catch (error) {
      console.error(`Error adding Bulletin: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  private async getBulletin(req: express.Request, res: express.Response) {
    try {
      const cachedData = DataConsolidator.checkJsonFile(this.jsonFilePath);

      if (cachedData) {
        console.debug(`Bulletins saved locally were sent successfully.`);
        res.json(cachedData);
      } else {
        const bulletins = await DataConsolidator.fetchAndSaveData(
          this.jsonFilePath
        );
        console.debug(
          `${bulletins.length} Bulletins were reimported and sent successfully.`
        );
        res.json({ bulletins });
      }
    } catch (error) {
      console.error(`Error consolidating data: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  private deleteBulletin(req: express.Request, res: express.Response) {
    try {
      const bulletinIdToDelete = req.params.id;

      const rawData = fs.readFileSync(this.jsonFilePath, "utf8");
      const consolidatedData = JSON.parse(rawData);

      const bulletinIndex = consolidatedData.bulletins.findIndex(
        (bulletin: Bulletin) => bulletin.id === Number(bulletinIdToDelete)
      );

      if (bulletinIndex === -1) {
        console.error(
          `Bulletin ID: ${req.params.id} not found, and therefore, the deletion failed.`
        );
        res.status(404).json({ error: "Bulletin not found" });
      } else {
        consolidatedData.bulletins.splice(bulletinIndex, 1);

        fs.writeFileSync(
          this.jsonFilePath,
          JSON.stringify(consolidatedData, null, 2)
        );

        console.debug(`Bulletin id: ${req.params.id} deleted successfully`);
        res.json({ message: "Bulletin deleted successfully" });
      }
    } catch (error) {
      console.error(`Error deleting bulletin: ${error}`);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  public start(port: number) {
    this.server = this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }

  public close() {
    if (this.server) {
      this.server.close(() => {
        console.log("Server is closed");
      });
    }
  }
}
