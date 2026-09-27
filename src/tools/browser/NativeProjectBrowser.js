class NativeProjectBrowser {
  constructor() {}

  static open() {
    console.log('[NativeProjectBrowser] Inactive stub - use Luno Projects Hub.');
    return null;
  }

  open() {
    return NativeProjectBrowser.open();
  }

  close() {}
  render() {}
  destroy() {}

  init(options = {}) {
      return this;
    }

  mount(container) {
      return this;
    }
}

globalThis.NativeProjectBrowser = NativeProjectBrowser;
if (typeof module !== 'undefined' && module.exports) module.exports = NativeProjectBrowser;