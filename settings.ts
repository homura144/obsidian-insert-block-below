export interface InsertBlockBelowSettings {
  codeBlockWithoutBlankLine: boolean;
  autoTriggerTripleBacktick: boolean;
  autoTriggerTripleDollar: boolean;
}

export const DEFAULT_SETTINGS: InsertBlockBelowSettings = {
  codeBlockWithoutBlankLine: false,
  autoTriggerTripleBacktick: true,
  autoTriggerTripleDollar: true,
};
