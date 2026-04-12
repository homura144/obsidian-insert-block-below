import esbuild from "esbuild";

const watch = process.argv.includes("--watch");

export const buildOptions = {
  entryPoints: ["main.ts"],
  bundle: true,
  outfile: "main.js",
  format: "cjs",
  platform: "browser",
  target: "es2020",
  external: ["obsidian", "@codemirror/view", "@codemirror/state"],
  sourcemap: "inline",
  logLevel: "info",
};

const context = await esbuild.context(buildOptions);

if (watch) {
  await context.watch();
} else {
  await context.rebuild();
  await context.dispose();
}
