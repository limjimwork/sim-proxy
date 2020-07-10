import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import axios from "axios";
import * as serverless from "serverless-http";

import * as dotenv from "dotenv";
dotenv.config();

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.configureRoutes();
  }

  private config(): void {
    this.app.use(cors());
  }

  private configureRoutes(): void {
    const coindataRouter = express.Router();
    const weatherInfoRouter = express.Router();

    coindataRouter.get("/orderbook", async (req: Request, res: Response) => {
      const currency = req.query["currency"];
      const url = `https://api.coinone.co.kr/orderbook`;
      try {
        const originalRes = await axios.get(url, {
          params: {
            currency,
          },
        });
        res.send(originalRes.data);
      } catch (err) {
        res.status(400);
        res.send({ message: "Failed to request orderbook." });
      }
    });

    coindataRouter.get("/ticker_utc", async (req: Request, res: Response) => {
      const currency = req.query["currency"];
      const url = `https://api.coinone.co.kr/ticker_utc`;
      try {
        const originalRes = await axios.get(url, {
          params: {
            currency,
          },
        });
        res.send(originalRes.data);
      } catch (err) {
        res.status(400);
        res.send({ message: "Failed to request ticker_utc." });
      }
    });

    coindataRouter.get("/trades", async (req: Request, res: Response) => {
      const currency = req.query["currency"];
      const url = `https://api.coinone.co.kr/trades`;
      try {
        const originalRes = await axios.get(url, {
          params: {
            currency,
          },
        });
        res.send(originalRes.data);
      } catch (err) {
        res.status(400);
        res.send({ message: "Failed to request trades." });
      }
    });

    weatherInfoRouter.get("/", async (req: Request, res: Response) => {
      const url =
        "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst";
      try {
        const originalRes = await axios.get(url, {
          params: {
            ServiceKey: process.env.WEATHERINFO_API_SERVICE_KEY,
            _returnType: "json",
            ...req.query,
          },
        });
        res.send(originalRes.data);
      } catch (err) {
        res.status(400);
        res.send({ message: "Failed to request." });
      }
    });

    this.app.use("/.netlify/functions/api/coindata", coindataRouter);
    this.app.use("/.netlify/functions/api/weatherInfo", weatherInfoRouter);
  }

  public listen(port: string, cb: () => void): void {
    this.app.listen(port, cb);
  }
}

const app = new App();
const handler = serverless(app.app);

export { app, handler };
