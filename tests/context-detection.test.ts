import assert from "node:assert/strict";
import test from "node:test";

import {
	endsWithTrigger,
	isEmptyBacktickSpecialCase,
	isEmptyDollarSpecialCase,
	isInsideFencedCodeBlock,
	isInsideInlineMath,
} from "../context-detection";

test("matches triple backtick trigger at line end even with leading text", () => {
	assert.equal(endsWithTrigger("prefix```", "```"), true);
});

test("does not match triple backtick trigger when trailing content exists", () => {
	assert.equal(endsWithTrigger("prefix```lang", "```"), false);
});

test("recognizes the empty backtick special case", () => {
	assert.equal(isEmptyBacktickSpecialCase("```", 2), true);
});

test("recognizes the empty dollar special case", () => {
	assert.equal(isEmptyDollarSpecialCase("$$$", 2), true);
});

test("detects inline math conservatively", () => {
	assert.equal(isInsideInlineMath("before $x$ after", 9), false);
	assert.equal(isInsideInlineMath("before $x", 9), true);
});

test("detects whether the cursor is inside an unclosed fenced code block", () => {
	assert.equal(isInsideFencedCodeBlock("```ts\nconst x = 1;\n", 1), true);
	assert.equal(isInsideFencedCodeBlock("```ts\nconst x = 1;\n```\n", 2), false);
});
