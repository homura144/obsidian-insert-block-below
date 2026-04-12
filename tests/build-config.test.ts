import assert from "node:assert/strict";
import test from "node:test";

import { buildOptions } from "../esbuild.config.mjs";

test("externalizes codemirror packages to avoid duplicate editor instances", () => {
	assert.ok(buildOptions.external?.includes("obsidian"));
	assert.ok(buildOptions.external?.includes("@codemirror/view"));
	assert.ok(buildOptions.external?.includes("@codemirror/state"));
});
