class CommsFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/comms",
          "capsules": [
                "ClientStateManager.js",
                "LocalDirectoryStore.js",
                "VirtualFileSystem.js",
                "LocalDirSessionManager.js",
                "TeleporterBridge.js"
          ]
    };
  }
}

globalThis.CommsFolderMeta = CommsFolderMeta;
if (typeof window !== "undefined") window.CommsFolderMeta = CommsFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = CommsFolderMeta;
