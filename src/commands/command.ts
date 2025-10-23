#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";
import { decrypt } from "../utils";
import inquirer from "inquirer";

const program = new Command();
program
  .name("mydbportal-cli")
  .description("CLI to control your databases")
  .version("0.0.1");

program
  .command("list")
  .description("List all your databases")
  .action(async () => {
    const dtoken = fs.readFileSync(
      path.join(process.cwd(), "t/ts.key"),
      "utf-8",
    );
    const token = decrypt(dtoken);

    const res = await fetch("http://localhost:6100/api/cli", {
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

    if (!Array.isArray(dbs) || dbs.length === 0) {
      console.log(" No databases found.");
      return;
    }

    const answer = await inquirer.prompt({
      name: "databases",
      message: "Select a database:",
      type: "rawlist",
      choices: dbs.map((db: any) => ({
        name: `${db.name} (${db.server})`,
        value: db.id,
      })),
    });

    console.log(" You selected:", answer.database);
  });

program
  .command("create")
  .description("Create database")
  .action(async () => {
    const answers = await inquirer.prompt({
      name: "create database",
      message: "input name",
    });
  });

program.parse();
