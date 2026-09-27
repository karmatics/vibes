class UnifiedProtocolExecutor {
  constructor(app) {
    this.app = app;
  }

  static detectProtocol(text) {
    if (!text || typeof text !== 'string') return 'UNKNOWN';
    const trimmed = text.trim();
    if (/<(script|style|template|svg)\b/i.test(trimmed)) {
      return 'LUNO_HTML_CONTAINER';
    }
    return 'UNKNOWN';
  }

  detectProtocol(text) {
    return UnifiedProtocolExecutor.detectProtocol(text);
  }

  static async execute(payloadText, app) {
    const executor = new UnifiedProtocolExecutor(app);
    return await executor.execute(payloadText);
  }

  async execute(payloadText) {
    if (!payloadText || typeof payloadText !== 'string' || !payloadText.trim()) {
      return { success: false, error: 'Empty payload provided to executor' };
    }

    // Direct all incoming payloads exclusively through LunoProtocolExecutor
    if (typeof LunoProtocolExecutor !== 'undefined' && typeof LunoProtocolExecutor.execute === 'function') {
      return await LunoProtocolExecutor.execute(payloadText, this.app);
    }

    throw new Error('[UnifiedProtocolExecutor] LunoProtocolExecutor is unavailable in client runtime.');
  }

  static detectFileReplace(text) {
      if (!text || typeof text !== 'string') return false;
      const parser = globalThis.LunoPayloadParser;
      if (!parser || typeof parser.parse !== 'function') return false;
      try {
        const parsed = parser.parse(text);
        return (parsed.files || []).some(f => !f.methodSpec && f.action !== 'patch' && f.action !== 'delete');
      } catch (e) {
        return false;
      }
    }

  static detectClassReplace(text) {
      if (!text || typeof text !== 'string') return false;
      const parser = globalThis.LunoPayloadParser;
      if (!parser || typeof parser.parse !== 'function') return false;
      try {
        const parsed = parser.parse(text);
        return (parsed.files || []).some(f => Boolean(f.methodSpec || f.action === 'patch'));
      } catch (e) {
        return false;
      }
    }
}

globalThis.UnifiedProtocolExecutor = UnifiedProtocolExecutor;
if (typeof module !== 'undefined' && module.exports) module.exports = UnifiedProtocolExecutor;