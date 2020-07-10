import * as express from "express";
import { Request, Response } from "express";
import * as cors from "cors";
import axios from "axios";
import * as serverless from "serverless-http";

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
    const router = express.Router();
    router.get("/orderbook", async (req: Request, res: Response) => {
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
        res.send({ message: "failed to request orderbook." });
      }
    });

    router.get("/ticker_utc", async (req: Request, res: Response) => {
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
        res.send({ message: "failed to request ticker_utc." });
      }
    });

    router.get("/trades", async (req: Request, res: Response) => {
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
        res.send({ message: "failed to request trades." });
      }
    });

    this.app.use("/.netlify/functions/api", router);
  }

  public listen(port: string, cb: () => void): void {
    this.app.listen(port, cb);
  }
}

const app = new App();
const handler = serverless(app.app);

export { app, handler };
