#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { decrypt, getGlobalKey, oauthSignIn } from "../utils";
import inquirer from "inquirer";
import { stdout } from "process";
import yoctoSpinner from "yocto-spinner";
import { startServerOnce } from "../server";

const program = new Command();
const mydbportalUrl = "https://mydbportal.com/";
const spinner = yoctoSpinner({ text: "mydbportal…" }).start();
program
  .name("mydbportal-cli")
  .description("CLI to control your databases")
  .version("0.0.1");

program
  .command("list")
  .description("List all your databases")
  .action(async () => {
    const dtoken = getGlobalKey();

    const token = decrypt(dtoken);

    spinner.start();
    const res = await fetch(`${mydbportalUrl}/api/cli`, {
      headers: {
        Cookie: `authjs.session-token=${token}`,
      },
    });

    const jsons: any = await res.json();

    const dbs = jsons.databases.map((d: any) => ({
      name: d.name,
      id: d.id,
      server: d.server.region,
    }));
    spinner.success();

    if (!Array.isArray(dbs) || dbs.length === 0) {
      console.log(" No databases found.");
      return;
    }

    const answer = await inquirer.prompt({
      name: "database",
      message: "Select a database:",
      type: "rawlist",
      choices: dbs.map((db: any) => ({
        name: `${db.name} (${db.server})`,
        value: db.id,
      })),
    });

    spinner.start();

    const results = await fetch(`${mydbportalUrl}/api/cli${answer.database}`, {
      headers: {
        Cookie: `authjs.session-token=${token}`,
      },
    });
    spinner.success();
    const data = await results.json();

    console.log(data);
  });

program
  .command("create")
  .description("Create database")
  .action(async () => {
    const dtoken = getGlobalKey();

    const token = decrypt(dtoken);
    spinner.start();
    const res = await fetch(`${mydbportalUrl}/api/cli`, {
      headers: {
        Cookie: `authjs.session-token=${token}`,
      },
    });
    const jsons: any = await res.json();
    spinner.success();
    const availableServers = jsons.servers.map((s: any) => ({
      name: s.name,
      id: s.id,
      region: s.region,
    }));
    const dbtype = await inquirer.prompt({
      name: "type",
      message: "chose database type",
      type: "list",
      choices: ["MySQL", "PostgreSQL", "MongoDB"],
    });
    const dbname = await inquirer.prompt({
      name: "name",
      message: "input name",
      type: "input",
    });
    const serverid = await inquirer.prompt({
      name: "server",
      message: "Choose server",
      type: "rawlist",
      choices: availableServers.map((a: any) => ({
        name: `${a.name} (${a.region})`,
        value: `${a.id}`,
      })),
    });

    const formData = new FormData();
    formData.append("name", dbname.name);
    formData.append("type", dbtype.type);
    formData.append("serverId", serverid.server);
    spinner.start("Creating database");
    const result = await fetch(`${mydbportalUrl}/api/cli`, {
      method: "POST",
      headers: {
        Cookie: `authjs.session-token=${token}`,
      },
      body: formData,
    });
    spinner.success();
    const connectionString: any = await result.json();
    const envpath = path.join(process.cwd(), ".env");
    fs.mkdirSync(path.dirname(envpath), { recursive: true });

    fs.writeFile(
      envpath,
      `DATABASE_URL =${connectionString}`,
      { flag: "a" },
      (err) => {
        if (err) throw err;
        console.log("Added to file!");
      }
    );
    console.log(connectionString);
  });

program
  .command("login")
  .description("login to mydbportal")
  .action(async () => {
    spinner.start("Openning browser");
    await oauthSignIn();
    spinner.success();
    await startServerOnce();
  });
program.parse();
