import { Editor } from "obsidian";

import { buildBlockInsertion } from "./insert-block";
import { getLineContext } from "./line-context";

type EditorLike = Pick<
	Editor,
	"getCursor" | "getLine" | "replaceRange" | "setCursor"
>;

export interface InsertBlockOptions {
	codeBlockWithoutBlankLine?: boolean;
}

export function insertBlockBelow(
	editor: EditorLike,
	delimiter: string,
	options: InsertBlockOptions = {},
): void {
	const cursor = editor.getCursor();
	const line = editor.getLine(cursor.line);
	const context = getLineContext(line);
	const insertion = buildBlockInsertion(context, delimiter, options);
	const insertAt = { line: cursor.line + 1, ch: 0 };

	editor.replaceRange(`${insertion.text}\n`, insertAt);
	editor.setCursor({
		line: cursor.line + insertion.cursorLineOffset,
		ch: insertion.cursorCh,
	});
}
