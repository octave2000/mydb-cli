import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { encrypt, saveGlobalKey } from "./utils";

const PORT = 5000;

//callable server
export async function startServerOnce() {
  return new Promise<void>((resolve, reject) => {
    const tPath = path.join(process.cwd(), "t");
    fs.mkdirSync(tPath, { recursive: true });

    const app = express();
    app.use(express.json({ limit: "10kb" }));

    const server = app.listen(PORT, (err) => {
      if (err) {
        console.error(err);
      }
    });

    const shutdown = (reason: string) => {
      console.log("successfully logged in");
      server.close(() => {
        resolve();
      });
    };

    app.post("/", async (req: Request, res: Response) => {
      const cookies = await req.body;

      const token = cookies.value;

      if (!token) {
        res.status(400).send("No token found");
        return;
      }

      const encrypted = encrypt(token);
      saveGlobalKey(encrypted);

      res.json({ message: "success" });

      setTimeout(() => shutdown("Token captured successfully"), 100);
    });

    setTimeout(() => {
      shutdown(" no request received");
    }, 2 * 60 * 1000);
  });
}
