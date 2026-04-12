import type { LineContext } from "./line-context";

export interface BlockInsertion {
	text: string;
	cursorLineOffset: number;
	cursorCh: number;
}

export interface BuildBlockOptions {
	codeBlockWithoutBlankLine?: boolean;
}

export function buildBlockInsertion(
	context: LineContext,
	delimiter: string,
	options: BuildBlockOptions = {},
): BlockInsertion {
	const linePrefix = `${context.containerPrefix}${context.nextContentIndent}`;
	const isCodeBlock = delimiter === "```";

	if (isCodeBlock && options.codeBlockWithoutBlankLine) {
		return {
			text: `${linePrefix}${delimiter}\n${linePrefix}${delimiter}`,
			cursorLineOffset: 1,
			cursorCh: linePrefix.length + delimiter.length,
		};
	}

	return {
		text: `${linePrefix}${delimiter}\n${linePrefix}\n${linePrefix}${delimiter}`,
		cursorLineOffset: 2,
		cursorCh: linePrefix.length,
	};
}
