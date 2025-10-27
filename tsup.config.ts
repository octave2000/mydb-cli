import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/commands/command.ts"],
  format: ["esm", "cjs"],
  dts: true,
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".js",
    };
  },
});
