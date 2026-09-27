class AppProtocolHandler {
  constructor(app) {
    this.app = app;
    this.unifiedExecutor = new UnifiedProtocolExecutor(app);
  }

  async execute(text) {
    return await this.handleIncomingText(text);
  }

  async handlePaste(text) {
    return await this.handleIncomingText(text);
  }

  async processPaste(text) {
    return await this.handleIncomingText(text);
  }

  async handleIncomingText(text) {
    if (!text || typeof text !== 'string' || !text.trim()) return false;

    // Scan for HTML container tags anywhere in the payload (ignoring leading text / fences)
    if (/<(script|style|template|svg)\b/i.test(text)) {
      try {
        if (typeof LunoProtocolExecutor !== 'undefined') {
          await LunoProtocolExecutor.execute(text, this.app);
          return true;
        }
        if (typeof UnifiedProtocolExecutor !== 'undefined') {
          await UnifiedProtocolExecutor.execute(text, this.app);
          return true;
        }
      } catch (err) {
        console.error('[AppProtocolHandler Exception]', err);
        if (this.app && this.app.uiManager && typeof this.app.uiManager.showToast === 'function') {
          this.app.uiManager.showToast('Protocol error: ' + err.message, 'error');
        }
        return false;
      }
    }

    return false;
  }
}

globalThis.AppProtocolHandler = AppProtocolHandler;
if (typeof module !== 'undefined' && module.exports) module.exports = AppProtocolHandler;