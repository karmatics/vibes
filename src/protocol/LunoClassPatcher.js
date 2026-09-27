// [RETIRED]: Consolidated into canonical LunoParser library (/LunoParser/)
// Delegating to globalThis.LunoClassPatcher and globalThis.LunoPayloadParser
if (typeof globalThis.LunoClassPatcher !== 'undefined') {
  globalThis.ClientJSClassPatcher = globalThis.LunoClassPatcher;
}
