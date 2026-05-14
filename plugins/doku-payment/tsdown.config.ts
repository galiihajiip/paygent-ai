import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["index.ts"],
  format: "esm",
  outDir: "dist",
  dts: true,
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
});
