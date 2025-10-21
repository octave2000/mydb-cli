import express, { type Request, type Response } from "express";
import fs from "fs";
import keytar from "keytar";

const PORT = 3000;
const SERVICE = "mydbportal";
const ACCOUNT = "user_credentials";
const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/", async (req: Request, res: Response) => {
  const cookies = req.headers.cookie;
  const contents = cookies?.split(";");
  if (!contents) {
    return;
  }
  const token = contents[0]?.split("=")[1];
  if (!token) {
    res.status(400).send("No token found");
    return;
  }
  await keytar.setPassword(SERVICE, ACCOUNT, token);
  res.send("✅ Logged in successfully! You can close this tab.");
});

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
