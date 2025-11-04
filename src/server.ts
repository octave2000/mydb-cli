import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { encrypt, saveGlobalKey } from "./utils";
import cors from "cors";

const PORT = 5000;

//callable server
export async function startServerOnce() {
  return new Promise<void>((resolve, reject) => {
    const app = express();
    app.use(express.json({ limit: "10kb" }));
    app.use(
      cors({
        origin: [
          "http://localhost:5000",
          "https://www.mydbportal.com",
          "https://mydbportal.com",
        ],
      })
    );
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

    app.get("/", async (req: Request, res: Response) => {
      const tokenFromRequest = req.query.token;
      if (!tokenFromRequest) {
        res.status(400).send("No token found");
        return;
      }

      const encrypted = encrypt(String(tokenFromRequest));
      saveGlobalKey(encrypted);

      res.send(
        `
        <html>
              <head>
                <title>Mydbportal</title>
                <style>
                  body {
                    font-family: sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: #f6f8fa;
                  }
                  .box {
                    background: white;
                    padding: 2rem 3rem;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div class="box">
                  <h1> Login successful!</h1>
                  <p>You can safely close this tab now.</p>
                </div>
              </body>
            </html>
          `
      );

      setTimeout(() => shutdown("Token captured successfully"), 100);
    });

    setTimeout(() => {
      shutdown(" no request received");
    }, 2 * 60 * 1000);
  });
}
