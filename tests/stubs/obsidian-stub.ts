export class Workspace {
  getActiveViewOfType<T>(): T | null {
    return null;
  }
}

export class App {
  workspace = new Workspace();
}

export class Plugin {
  app: App;

  constructor() {
    this.app = new App();
  }

  async onload(): Promise<void> {}
  async onunload(): Promise<void> {}
  async loadData(): Promise<unknown> {
    return null;
  }
  async saveData(): Promise<void> {}
  addCommand(): void {}
  addSettingTab(): void {}
  registerEditorExtension(): void {}
}

export class Notice {
  static lastMessage: string | null = null;

  constructor(public message: string) {
    Notice.lastMessage = message;
  }
}

export class MarkdownView {
  editor?: EditorLike;
}

export type EditorLike = {
  getCursor(): { line: number; ch: number };
  getLine(line: number): string;
  replaceRange(text: string, from: { line: number; ch: number }): void;
  setCursor(cursor: { line: number; ch: number }): void;
};

export class Editor implements EditorLike {
  getCursor() {
    return { line: 0, ch: 0 };
  }
  getLine() {
    return "";
  }
  replaceRange() {}
  setCursor() {}
}

export class Setting {
  containerEl: { empty: () => void };
  name?: string;

  constructor(containerEl: { empty: () => void }) {
    this.containerEl = containerEl;
  }

  setName(name: string) {
    this.name = name;
    return this;
  }

  addToggle(
    callback: (toggle: {
      setValue(value: boolean): typeof toggle;
      onChange(onChange: (value: boolean) => void): typeof toggle;
    }) => void,
  ) {
    const toggle = {
      value: false,
      setValue(value: boolean) {
        this.value = value;
        return this;
      },
      onChange(_onChange: (value: boolean) => void) {
        return this;
      },
    };
    callback(toggle);
    return this;
  }
}

export class PluginSettingTab {
  app: App;
  plugin: Plugin;
  containerEl: { empty: () => void };

  constructor(app: App, plugin: Plugin) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = { empty: () => {}, appendChild: () => {} } as {
      empty: () => void;
      appendChild: (child: unknown) => void;
    };
  }

  display(): void {}
}
