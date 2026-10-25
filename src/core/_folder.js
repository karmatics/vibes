class CoreFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/core",
          "capsules": [
                "KeystrokeHandler.js",
                "Path.js",
                "PromptInjector.js"
          ]
    };
  }
}

globalThis.CoreFolderMeta = CoreFolderMeta;
if (typeof window !== "undefined") window.CoreFolderMeta = CoreFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = CoreFolderMeta;
