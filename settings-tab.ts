import { App, PluginSettingTab, Setting } from "obsidian";

import type InsertBlockBelowPlugin from "./main";

export class InsertBlockBelowSettingTab extends PluginSettingTab {
  plugin: InsertBlockBelowPlugin;

  constructor(app: App, plugin: InsertBlockBelowPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Code block without blank line")
      .setDesc(
        "Insert ``` without a blank line between the fences, and place the cursor at the end of the opening ```.",
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.codeBlockWithoutBlankLine)
          .onChange(async (value) => {
            this.plugin.settings.codeBlockWithoutBlankLine = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Auto trigger when typing ```")
      .setDesc("Type ``` at the end of a line to expand into a ``` block below.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoTriggerTripleBacktick)
          .onChange(async (value) => {
            this.plugin.settings.autoTriggerTripleBacktick = value;
            await this.plugin.saveSettings();
          }),
      );

    new Setting(containerEl)
      .setName("Auto trigger when typing $$$")
      .setDesc("Type $$$ at the end of a line to expand into a $$ block below.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.autoTriggerTripleDollar)
          .onChange(async (value) => {
            this.plugin.settings.autoTriggerTripleDollar = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
