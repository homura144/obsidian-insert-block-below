import assert from "node:assert/strict";
import test from "node:test";

import { Notice } from "obsidian";
import InsertBlockBelowPlugin from "../main";
import { DEFAULT_SETTINGS } from "../settings";

class FakePlugin extends InsertBlockBelowPlugin {
  commands: Array<{ id: string; name: string; callback: () => void }> = [];
  settingsTabs: unknown[] = [];
  editorExtensions: unknown[] = [];
  app = { workspace: { getActiveViewOfType: () => null } } as never;

  async loadData() {
    return null;
  }

  async saveData() {}

  addCommand(command: { id: string; name: string; callback: () => void }) {
    this.commands.push({ id: command.id, name: command.name, callback: command.callback });
  }

  addSettingTab(tab: unknown) {
    this.settingsTabs.push(tab);
  }

  registerEditorExtension(extension: unknown) {
    this.editorExtensions.push(extension);
  }
}

test("loads default settings and registers commands with a settings tab", async () => {
  const plugin = new FakePlugin();

  await plugin.onload();

  assert.deepEqual(plugin.settings, DEFAULT_SETTINGS);
  assert.deepEqual(
    plugin.commands.map((command) => ({ id: command.id, name: command.name })),
    [
      { id: "insert-math-block-below", name: "Insert math block below" },
      { id: "insert-code-block-below", name: "Insert code block below" },
    ],
  );
  assert.equal(plugin.settingsTabs.length, 1);
  assert.equal(plugin.editorExtensions.length, 1);
});

test("shows notice when no active markdown editor", async () => {
  const plugin = new FakePlugin();

  await plugin.onload();

  (Notice as { lastMessage?: string | null }).lastMessage = null;

  const command = plugin.commands.find((item) => item.id === "insert-code-block-below");
  assert.ok(command);
  command.callback();

  const lastNoticeMessage = (Notice as { lastMessage?: string | null }).lastMessage;
  assert.equal(lastNoticeMessage, "No active markdown editor");
});
