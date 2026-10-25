class ManagersFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/managers",
          "capsules": [
                "ActionInitializer.js",
                "FeatureManager.js",
                "GuidanceManager.js",
                "LlmQueueManager.js",
                "TabOrchestrator.js",
                "ProjectLoader.js",
                "UndoManager.js"
          ]
    };
  }
}

globalThis.ManagersFolderMeta = ManagersFolderMeta;
if (typeof window !== "undefined") window.ManagersFolderMeta = ManagersFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = ManagersFolderMeta;
