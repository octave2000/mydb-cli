import crypto from "crypto";
import fs from "fs";

export function oauthSignIn() {
  const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

  const params = {
    client_id:
      "1044296166148-pidlfu0hhd558f9j7hh726k7khu7udtm.apps.googleusercontent.com",

    redirect_uri: "http://localhost:3000",
    scope: "openid profile email",

    response_type: "token",

    prompt: "consent",

    state: "pass-through-value-" + Date.now().toString(),

    include_granted_scopes: "true",
  };

  const urlParams = new URLSearchParams(params).toString();
  const fullUrl = `${oauth2Endpoint}?${urlParams}`;

  console.log(`Open the following URL to log in:\n${fullUrl}`);
}

const ALGORITHM = "aes-256-ctr";
const SECRET_KEY = "12345678901234567890123456789012";
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
