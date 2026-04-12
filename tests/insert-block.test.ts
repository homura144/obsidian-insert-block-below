import assert from "node:assert/strict";
import test from "node:test";

import { buildBlockInsertion } from "../insert-block";
import type { LineContext } from "../line-context";

const paragraph: LineContext = {
	containerPrefix: "",
	contentIndent: "",
	nextContentIndent: "",
	isListItem: false,
};

const quotedList: LineContext = {
	containerPrefix: "> ",
	contentIndent: "",
	nextContentIndent: "\t",
	isListItem: true,
};

test("math block uses the computed prefix on all three lines", () => {
	assert.deepEqual(buildBlockInsertion(paragraph, "$$"), {
		text: "$$\n\n$$",
		cursorLineOffset: 2,
		cursorCh: 0,
	});
});

test("code block keeps quote prefix and tab indent", () => {
	assert.deepEqual(buildBlockInsertion(quotedList, "```"), {
		text: "> \t```\n> \t\n> \t```",
		cursorLineOffset: 2,
		cursorCh: 3,
	});
});

test("code block without blank line places cursor at the opening fence end", () => {
	assert.deepEqual(
		buildBlockInsertion(quotedList, "```", {
			codeBlockWithoutBlankLine: true,
		}),
		{
			text: "> \t```\n> \t```",
			cursorLineOffset: 1,
			cursorCh: 6,
		},
	);
});
