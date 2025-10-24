#!/usr/bin/env node

import express, { type Request, type Response } from "express";
import fs from "fs";
import path from "path";
import { encrypt, oauthSignIn, saveGlobalKey } from "./utils";

const PORT = 5000;
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

  res.send("Logged in successfully! You can close this tab.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
