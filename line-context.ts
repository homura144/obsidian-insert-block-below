export interface LineContext {
  containerPrefix: string;
  contentIndent: string;
  nextContentIndent: string;
  isListItem: boolean;
}

const LIST_ITEM_RE = /^(?:[-*+] |\d+(?:\.|\)) )/;

function getNestedIndentUnit(contentIndent: string): string {
  if (contentIndent.includes("\t") || contentIndent.length === 0) {
    return "\t";
  }

  if (contentIndent.length % 4 === 0) {
    return "    ";
  }

  if (contentIndent.length % 2 === 0) {
    return "  ";
  }

  return " ".repeat(contentIndent.length);
}

export function getLineContext(line: string): LineContext {
  const quoteMatch = line.match(/^((?:>\s*)*)/);
  let containerPrefix = quoteMatch?.[1] ?? "";
  let afterContainer = line.slice(containerPrefix.length);
  const trailingTabsMatch = containerPrefix.match(/\t+$/);
  const trailingTabs = trailingTabsMatch?.[0] ?? "";
  if (trailingTabs) {
    containerPrefix = containerPrefix.slice(0, -trailingTabs.length);
    afterContainer = `${trailingTabs}${afterContainer}`;
  }
  const indentMatch = afterContainer.match(/^[ \t]*/);
  const contentIndent = indentMatch?.[0] ?? "";
  const content = afterContainer.slice(contentIndent.length);
  const isListItem = LIST_ITEM_RE.test(content);
  const nextContentIndent = isListItem
    ? `${contentIndent}${getNestedIndentUnit(contentIndent)}`
    : contentIndent;

  return {
    containerPrefix,
    contentIndent,
    nextContentIndent,
    isListItem,
  };
}
