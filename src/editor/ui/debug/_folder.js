class DebugFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/ui/debug",
          "capsules": [
                "PendingStatusManager.js",
                "PendingTaskManager.js",
                "ShowDebugMessage.js",
                "ReportManager.js"
          ]
    };
  }
}

globalThis.DebugFolderMeta = DebugFolderMeta;
if (typeof window !== "undefined") window.DebugFolderMeta = DebugFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = DebugFolderMeta;
