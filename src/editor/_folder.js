class EditorFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor",
          "capsules": [
                "ActionRegistry.js",
                "AppearanceManager.js",
                "AppearanceAnimator.js",
                "AppStyles.js",
                "FileOperationLogger.js",
                "DocumentationManager.js",
                "ProjectAnalysisManager.js",
                "TaskRunner.js",
                "ProjectEditorApp.js",
                "UIVisibilityManager.js"
          ]
    };
  }
}

globalThis.EditorFolderMeta = EditorFolderMeta;
if (typeof window !== "undefined") window.EditorFolderMeta = EditorFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = EditorFolderMeta;
