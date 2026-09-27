class RecursiProtocolExecutor {
  constructor(app) {
    this.app = app;
  }

  static async execute(payloadText, app) {
    // Delegate directly to LunoProtocolExecutor
    if (typeof LunoProtocolExecutor !== 'undefined') {
      return await LunoProtocolExecutor.execute(payloadText, app);
    }
    throw new Error('[RecursiProtocolExecutor] Retired: LunoProtocolExecutor required.');
  }

  async execute(payloadText) {
    if (typeof LunoProtocolExecutor !== 'undefined') {
      return await LunoProtocolExecutor.execute(payloadText, this.app);
    }
    throw new Error('[RecursiProtocolExecutor] Retired: LunoProtocolExecutor required.');
  }

  parseAndPlan(text) {
    // Forward plan creation to LunoProtocolExecutor
    const parser = globalThis.LunoPayloadParser;
    const parsed = parser ? parser.parse(text) : { files: [] };
    const actions = (parsed.files || []).map(f => ({
      type: (f.methodSpec || f.action === 'patch') ? 'patch_method' : 'modify_file',
      path: f.filePath,
      method: f.methodSpec,
      content: f.content
    }));

    return {
      type: 'mutation_plan',
      actions: actions
    };
  }
}

globalThis.RecursiProtocolExecutor = RecursiProtocolExecutor;
if (typeof module !== 'undefined' && module.exports) module.exports = RecursiProtocolExecutor;