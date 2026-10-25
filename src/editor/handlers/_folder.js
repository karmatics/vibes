class HandlersFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/handlers",
          "capsules": [
                "AppActionHandler.js",
                "AppCommands.js",
                "AppProtocolHandler.js",
                "AppUIManager.js",
                "UnifiedProtocolExecutor.js",
                "VibesEnv.js"
          ]
    };
  }
}

globalThis.HandlersFolderMeta = HandlersFolderMeta;
if (typeof window !== "undefined") window.HandlersFolderMeta = HandlersFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = HandlersFolderMeta;
