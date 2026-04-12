import assert from "node:assert/strict";
import test from "node:test";

import { maybeExpandAutoTrigger } from "../auto-trigger";

class FakeEditor {
	lines: string[];
	cursor: { line: number; ch: number };

	constructor(lines: string[], cursor: { line: number; ch: number }) {
		this.lines = [...lines];
		this.cursor = cursor;
	}

	getCursor() {
		return this.cursor;
	}

	getLine(line: number) {
		return this.lines[line] ?? "";
	}

	replaceRange(
		text: string,
		from: { line: number; ch: number },
		to = from,
	) {
		const currentLine = this.lines[from.line] ?? "";
		const updatedLine =
			currentLine.slice(0, from.ch) + text + currentLine.slice(to.ch);

		if (!text.includes("\n")) {
			this.lines[from.line] = updatedLine;
			this.cursor = { line: from.line, ch: from.ch + text.length };
			return;
		}

		const insertedLines = text.endsWith("\n")
			? text.slice(0, -1).split("\n")
			: text.split("\n");
		this.lines.splice(from.line, 0, ...insertedLines);
		this.cursor = {
			line: from.line + insertedLines.length - 1,
			ch: insertedLines.at(-1)?.length ?? 0,
		};
	}

	setCursor(cursor: { line: number; ch: number }) {
		this.cursor = cursor;
	}
}

function buildDocument(lines: string[]): string {
	return lines.join("\n");
}

test("triple backtick trigger preserves leading text", () => {
	const editor = new FakeEditor(["prefix``"], { line: 0, ch: 8 });

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "`",
		lineAfterInput: "prefix```",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, true);
	assert.deepEqual(editor.lines, ["prefix", "```", "", "```"]);
});

test("triple dollar trigger preserves leading text", () => {
	const editor = new FakeEditor(["prefix$$"], { line: 0, ch: 8 });

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "$",
		lineAfterInput: "prefix$$$",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, true);
	assert.deepEqual(editor.lines, ["prefix", "$$", "", "$$"]);
});

test("does not trigger when characters follow the triple backtick", () => {
	const editor = new FakeEditor(["prefix```lang"], { line: 0, ch: 9 });

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "`",
		lineAfterInput: "prefix```lang",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, false);
});

test("does not trigger inside non-empty inline math", () => {
	const editor = new FakeEditor(["$x$$"], { line: 0, ch: 4 });

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "$",
		lineAfterInput: "$x$$$",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, false);
});

test("does trigger for the empty dollar special case", () => {
	const editor = new FakeEditor(["$$"], { line: 0, ch: 1 });

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "$",
		lineAfterInput: "$$$",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, true);
	assert.deepEqual(editor.lines, ["", "$$", "", "$$"]);
});

test("does trigger for the empty backtick special case", () => {
	const editor = new FakeEditor(["``"], { line: 0, ch: 1 });

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "`",
		lineAfterInput: "```",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, true);
	assert.deepEqual(editor.lines, ["", "```", "", "```"]);
});

test("does not trigger inside fenced code blocks", () => {
	const editor = new FakeEditor(["```ts", "``"], { line: 1, ch: 2 });

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "`",
		lineAfterInput: "```",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, false);
});

test("triple backtick trigger does not pull the next line into the current line", () => {
	const editor = new FakeEditor(
		["> [!note]", "> - Sfd``", "> - sfdlj"],
		{ line: 1, ch: 9 },
	);

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "`",
		lineAfterInput: "> - Sfd```",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: true,
	});

	assert.equal(didTrigger, true);
	assert.deepEqual(editor.lines, [
		"> [!note]",
		"> - Sfd",
		"> \t```",
		"> \t```",
		"> - sfdlj",
	]);
});

test("triple dollar trigger does not pull the next line into the current line", () => {
	const editor = new FakeEditor(
		["> [!note]", "> - Sfd$$", "> - sfdlj"],
		{ line: 1, ch: 9 },
	);

	const didTrigger = maybeExpandAutoTrigger(editor, {
		insertedText: "$",
		lineAfterInput: "> - Sfd$$$",
		documentBeforeCursor: buildDocument(editor.lines),
		autoTriggerTripleBacktick: true,
		autoTriggerTripleDollar: true,
		codeBlockWithoutBlankLine: false,
	});

	assert.equal(didTrigger, true);
	assert.deepEqual(editor.lines, [
		"> [!note]",
		"> - Sfd",
		"> \t$$",
		"> \t",
		"> \t$$",
		"> - sfdlj",
	]);
});
