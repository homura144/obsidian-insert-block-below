import assert from "node:assert/strict";
import test from "node:test";

import { getLineContext } from "../line-context";

test("plain paragraph keeps empty prefix and indent", () => {
  assert.deepEqual(getLineContext("plain text"), {
    containerPrefix: "",
    contentIndent: "",
    nextContentIndent: "",
    isListItem: false,
  });
});

test("list item adds one tab to the next content indent", () => {
  assert.deepEqual(getLineContext("- item"), {
    containerPrefix: "",
    contentIndent: "",
    nextContentIndent: "\t",
    isListItem: true,
  });
});

test("four-space-indented list preserves space indentation", () => {
  assert.deepEqual(getLineContext("    - item"), {
    containerPrefix: "",
    contentIndent: "    ",
    nextContentIndent: "        ",
    isListItem: true,
  });
});

test("two-space-indented list preserves space indentation", () => {
  assert.deepEqual(getLineContext("  - item"), {
    containerPrefix: "",
    contentIndent: "  ",
    nextContentIndent: "    ",
    isListItem: true,
  });
});

test("tab-indented list preserves tab indentation", () => {
  assert.deepEqual(getLineContext("\t- item"), {
    containerPrefix: "",
    contentIndent: "\t",
    nextContentIndent: "\t\t",
    isListItem: true,
  });
});

test("space-indented paragraph keeps its current indent without adding a level", () => {
  assert.deepEqual(getLineContext("    paragraph"), {
    containerPrefix: "",
    contentIndent: "    ",
    nextContentIndent: "    ",
    isListItem: false,
  });
});

test("blockquote preserves the quote prefix", () => {
  assert.deepEqual(getLineContext("> quoted line"), {
    containerPrefix: "> ",
    contentIndent: "",
    nextContentIndent: "",
    isListItem: false,
  });
});

test("callout body preserves the quote prefix and existing tab indent", () => {
  assert.deepEqual(getLineContext(">\tbody"), {
    containerPrefix: ">",
    contentIndent: "\t",
    nextContentIndent: "\t",
    isListItem: false,
  });
});

test("list item inside blockquote preserves the quote prefix and adds one tab", () => {
  assert.deepEqual(getLineContext("> - item"), {
    containerPrefix: "> ",
    contentIndent: "",
    nextContentIndent: "\t",
    isListItem: true,
  });
});

test("ordered list with parenthesis marker adds one tab to the next content indent", () => {
  assert.deepEqual(getLineContext("1) item"), {
    containerPrefix: "",
    contentIndent: "",
    nextContentIndent: "\t",
    isListItem: true,
  });
});
