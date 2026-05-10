import { build } from "esbuild";
import { execSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";

void (async () => {
  const nodeVersion = readFileSync(".nvmrc", "utf8").trim();
  const target = `node${nodeVersion}`;

  console.log("Compiling TypeScript...");
  execSync("tsc -p tsconfig.build.json", { stdio: "inherit" });

  console.log("Resolving path aliases...");
  execSync("tsc-alias -p tsconfig.build.json", { stdio: "inherit" });

  console.log("Bundling with esbuild...");
  await build({
    entryPoints: ["dist-tmp/index.js"],
    bundle: true,
    packages: "external",
    platform: "node",
    target,
    format: "cjs",
    minify: true,
    outfile: "dist/index.js",
  });

  console.log("Cleaning up...");
  rmSync("dist-tmp", { recursive: true, force: true });

  console.log("Build complete: dist/index.js");
})();
