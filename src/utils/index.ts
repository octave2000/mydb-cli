import crypto from "crypto";
import fs from "fs";
import path from "path";
import os from "os";
import open from "open";

const configDir = path.join(os.homedir(), ".mydp");
const keyPath = path.join(configDir, "key.json");
const secretPath = path.join(configDir, "secret.json");
function getSecret() {
  if (fs.existsSync(secretPath)) {
    const data = JSON.parse(fs.readFileSync(secretPath, "utf-8"));
    return Buffer.from(data.key, "hex");
  }
  const key = crypto.randomBytes(32);
  fs.writeFileSync(
    secretPath,
    JSON.stringify({ key: key.toString("hex") }),
    "utf8"
  );
  return key;
}

fs.mkdirSync(configDir, { recursive: true });
export async function oauthSignIn() {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = {
    client_id:
      "1044296166148-pidlfu0hhd558f9j7hh726k7khu7udtm.apps.googleusercontent.com",

    redirect_uri: "http://localhost:5000",
    scope: "openid profile email",

    response_type: "token",

    prompt: "consent",

    state: "pass-through-value-" + Date.now().toString(),

    include_granted_scopes: "true",
  };

  const urlParams = new URLSearchParams(params).toString();
  const fullUrl = `${oauth2Endpoint}?${urlParams}`;

  await open(fullUrl);
}

const ALGORITHM = "aes-256-ctr";
const SECRET_KEY = getSecret();
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, dataHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex!, "hex");
  const encrypted = Buffer.from(dataHex!, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

export function saveGlobalKey(key: any) {
  fs.writeFileSync(keyPath, JSON.stringify({ key }), "utf-8");
}

export function getGlobalKey() {
  if (!fs.existsSync(keyPath)) return null;
  const data = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
  return data.key;
}
