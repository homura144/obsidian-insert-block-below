import { EditorView } from "@codemirror/view";
import { MarkdownView, Notice, Plugin } from "obsidian";

import { maybeExpandAutoTrigger } from "./auto-trigger";
import { insertBlockBelow } from "./editor-actions";
import type { InsertBlockBelowSettings } from "./settings";
import { DEFAULT_SETTINGS } from "./settings";
import { InsertBlockBelowSettingTab } from "./settings-tab";

export default class InsertBlockBelowPlugin extends Plugin {
  settings!: InsertBlockBelowSettings;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new InsertBlockBelowSettingTab(this.app, this));
    this.registerEditorExtension(
      EditorView.inputHandler.of((view, from, to, text) => {
        if (from !== to || text.length !== 1) {
          return false;
        }

        const editor = this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
        if (!editor) {
          return false;
        }

        const line = view.state.doc.lineAt(from);
        const lineAfterInput =
          line.text.slice(0, from - line.from) + text + line.text.slice(to - line.from);
        const documentBeforeCursor = view.state.doc.sliceString(0, line.to);

        return maybeExpandAutoTrigger(editor, {
          insertedText: text,
          lineAfterInput,
          documentBeforeCursor,
          autoTriggerTripleBacktick: this.settings.autoTriggerTripleBacktick,
          autoTriggerTripleDollar: this.settings.autoTriggerTripleDollar,
          codeBlockWithoutBlankLine: this.settings.codeBlockWithoutBlankLine,
        });
      }),
    );

    this.addCommand({
      id: "insert-math-block-below",
      name: "Insert math block below",
      callback: () => this.runInsert("$$"),
    });

    this.addCommand({
      id: "insert-code-block-below",
      name: "Insert code block below",
      callback: () => this.runInsert("```"),
    });
  }

  async loadSettings(): Promise<void> {
    const stored = (await this.loadData()) as Partial<InsertBlockBelowSettings> | null;
    this.settings = {
      ...DEFAULT_SETTINGS,
      ...stored,
    };
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  private runInsert(delimiter: string): void {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const editor = view?.editor;

    if (!editor) {
      new Notice("No active markdown editor");
      return;
    }

    insertBlockBelow(editor, delimiter, {
      codeBlockWithoutBlankLine: this.settings.codeBlockWithoutBlankLine,
    });
  }
}
