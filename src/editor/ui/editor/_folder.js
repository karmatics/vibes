class EditorFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/ui/editor",
          "capsules": [
                "EditorDataHandler.js",
                "CodeSegment.js",
                "EditorTabController.js",
                "EditorViewManager.js",
                "FloatingEditorWindow.js"
          ]
    };
  }
}

globalThis.EditorFolderMeta = EditorFolderMeta;
if (typeof window !== "undefined") window.EditorFolderMeta = EditorFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = EditorFolderMeta;
