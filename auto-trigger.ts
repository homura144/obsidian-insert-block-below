import { insertBlockBelow } from "./editor-actions";
import {
	endsWithTrigger,
	isEmptyBacktickSpecialCase,
	isEmptyDollarSpecialCase,
	isInsideFencedCodeBlock,
	isInsideInlineMath,
} from "./context-detection";

type EditorLike = Parameters<typeof insertBlockBelow>[0];

export interface AutoTriggerOptions {
	insertedText: string;
	lineAfterInput: string;
	documentBeforeCursor: string;
	autoTriggerTripleBacktick: boolean;
	autoTriggerTripleDollar: boolean;
	codeBlockWithoutBlankLine: boolean;
}

export function maybeExpandAutoTrigger(
	editor: EditorLike,
	options: AutoTriggerOptions,
): boolean {
	const cursor = editor.getCursor();
	const line = options.lineAfterInput;
	const fenceContextLine = cursor.line - 1;
	const backtickSpecialCase = isEmptyBacktickSpecialCase(line, cursor.ch);
	const dollarSpecialCase = isEmptyDollarSpecialCase(line, cursor.ch);

	if (
		options.insertedText === "`" &&
		options.autoTriggerTripleBacktick &&
		(endsWithTrigger(line, "```") || backtickSpecialCase) &&
		!isInsideFencedCodeBlock(options.documentBeforeCursor, fenceContextLine)
	) {
		const triggerStart = line.length - 3;
		const triggerEndBeforeInput = line.length - 1;
		editor.replaceRange(
			"",
			{ line: cursor.line, ch: triggerStart },
			{ line: cursor.line, ch: triggerEndBeforeInput },
		);
		insertBlockBelow(editor, "```", {
			codeBlockWithoutBlankLine: options.codeBlockWithoutBlankLine,
		});
		return true;
	}

	if (
		options.insertedText === "$" &&
		options.autoTriggerTripleDollar &&
		(endsWithTrigger(line, "$$$") || dollarSpecialCase) &&
		!isInsideFencedCodeBlock(options.documentBeforeCursor, fenceContextLine)
	) {
		const triggerStart = line.length - 3;
		const triggerEndBeforeInput = line.length - 1;
		const inlineMathPrefix = line.slice(0, triggerStart);
		const insideNonEmptyInlineMath =
			inlineMathPrefix.length > 0 &&
			isInsideInlineMath(inlineMathPrefix, inlineMathPrefix.length - 1);

		if (insideNonEmptyInlineMath && !dollarSpecialCase) {
			return false;
		}

		editor.replaceRange(
			"",
			{ line: cursor.line, ch: triggerStart },
			{ line: cursor.line, ch: triggerEndBeforeInput },
		);
		insertBlockBelow(editor, "$$", {
			codeBlockWithoutBlankLine: options.codeBlockWithoutBlankLine,
		});
		return true;
	}

	return false;
}
