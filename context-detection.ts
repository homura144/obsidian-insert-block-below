export function endsWithTrigger(line: string, trigger: string): boolean {
	return line.endsWith(trigger);
}

export function isEmptyBacktickSpecialCase(
	line: string,
	cursorCh: number,
): boolean {
	return line === "```" && cursorCh === 2;
}

export function isEmptyDollarSpecialCase(
	line: string,
	cursorCh: number,
): boolean {
	return line === "$$$" && cursorCh === 2;
}

export function isInsideInlineMath(line: string, cursorCh: number): boolean {
	const beforeCursor = line.slice(0, cursorCh + 1);
	const dollarCount = [...beforeCursor].filter((char) => char === "$").length;
	return dollarCount % 2 === 1;
}

export function isInsideFencedCodeBlock(
	documentBeforeCursor: string,
	cursorLine: number,
): boolean {
	const lines = documentBeforeCursor.split("\n").slice(0, cursorLine + 1);
	let fenceCount = 0;

	for (const line of lines) {
		if (line.trimStart().startsWith("```")) {
			fenceCount += 1;
		}
	}

	return fenceCount % 2 === 1;
}
