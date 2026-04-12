export interface LineContext {
  containerPrefix: string;
  contentIndent: string;
  nextContentIndent: string;
  isListItem: boolean;
}

const LIST_ITEM_RE = /^(?:[-*+] |\d+(?:\.|\)) )/;

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
  const indentMatch = afterContainer.match(/^\t*/);
  const contentIndent = indentMatch?.[0] ?? "";
  const content = afterContainer.slice(contentIndent.length);
  const isListItem = LIST_ITEM_RE.test(content);
  const nextContentIndent = isListItem ? `${contentIndent}\t` : contentIndent;

  return {
    containerPrefix,
    contentIndent,
    nextContentIndent,
    isListItem,
  };
}
