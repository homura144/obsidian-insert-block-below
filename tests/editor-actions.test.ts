import assert from "node:assert/strict";
import test from "node:test";

import { insertBlockBelow } from "../editor-actions";

class FakeEditor {
  lines: string[];
  cursor = { line: 0, ch: 0 };
  lastReplaceRangeText: string | null = null;

  constructor(lines: string[]) {
    this.lines = [...lines];
  }

  getCursor() {
    return this.cursor;
  }

  getLine(line: number) {
    return this.lines[line] ?? "";
  }

  replaceRange(text: string, from: { line: number; ch: number }) {
    this.lastReplaceRangeText = text;
    const inserted = text.endsWith("\n")
      ? text.slice(0, -1).split("\n")
      : text.split("\n");
    this.lines.splice(from.line, 0, ...inserted);
  }

  setCursor(cursor: { line: number; ch: number }) {
    this.cursor = cursor;
  }
}

test("inserts a math block below a list item and moves the cursor into the middle line", () => {
  const editor = new FakeEditor(["- item"]);

  insertBlockBelow(editor, "$$");

  assert.deepEqual(editor.lines, ["- item", "\t$$", "\t", "\t$$"]);
  assert.deepEqual(editor.cursor, { line: 2, ch: 1 });
});

test("inserts a code block below a quoted list item", () => {
  const editor = new FakeEditor(["> - item"]);

  insertBlockBelow(editor, "```");

  assert.deepEqual(editor.lines, ["> - item", "> \t```", "> \t", "> \t```"]);
  assert.deepEqual(editor.cursor, { line: 2, ch: 3 });
});

test("appends a trailing newline when inserting the block", () => {
  const editor = new FakeEditor(["- item"]);

  insertBlockBelow(editor, "$$");

  assert.equal(editor.lastReplaceRangeText?.endsWith("\n"), true);
});

test("uses two-line code block mode when enabled", () => {
  const editor = new FakeEditor(["- item"]);

  insertBlockBelow(editor, "```", {
    codeBlockWithoutBlankLine: true,
  });

  assert.deepEqual(editor.lines, ["- item", "\t```", "\t```"]);
  assert.deepEqual(editor.cursor, { line: 1, ch: 4 });
});
