#!/usr/bin/env node

import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { encrypt } from "./utils";

const PORT = 3000;
const tPath = path.join(process.cwd(), "t");
fs.mkdirSync(tPath, { recursive: true });

const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/", async (req: Request, res: Response) => {
  const cookies = req.headers.cookie;
  console.log("Cookies header:", cookies);

  if (!cookies) {
    res.status(400).send("No cookies found");
    return;
  }

  const token = cookies.split(";")[0]?.split("=")[1];
  if (!token) {
    res.status(400).send("No token found");
    return;
  }

  const encrypted = encrypt(token);

  const filePath = path.join(tPath, "ts.key");
  console.log("Writing token to:", filePath);

  fs.writeFileSync(filePath, encrypted);

  res.send("Logged in successfully! You can close this tab.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
