import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { encrypt, saveGlobalKey } from "./utils";

const PORT = 5000;

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
      server.close(() => {
        resolve();
      });
    };

    app.get("/", async (req: Request, res: Response) => {
      const cookies = req.headers.cookie;
      if (!cookies) {
        res.status(400).send("No cookies found");
        return;
      }

      const token = cookies
        ?.split(";")
        .find((c) => c.trim().startsWith("authjs.session-token="))
        ?.split("=")[1];

      if (!token) {
        res.status(400).send("No token found");
        return;
      }

      const encrypted = encrypt(token);
      saveGlobalKey(encrypted);

      res.send("Logged in successfully, You can close this tab.");

      shutdown("Token captured successfully");
    });

    setTimeout(() => {
      shutdown(" no request received");
    }, 2 * 60 * 1000);
  });
}
