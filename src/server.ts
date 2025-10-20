import express, { type Request, type Response } from "express";

const PORT = 3000;
const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/", (req: Request, res: Response) => {
  const cookies = req.headers.cookie;
  console.log("cookies", cookies);
});

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
