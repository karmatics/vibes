class ToolsFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/ui/tools",
          "capsules": [
                "ClipboardCatcherWidget.js",
                "FileSearchWidget.js",
                "ProjectWalkerTool.js",
                "GlowDrawer.js"
          ]
    };
  }
}

globalThis.ToolsFolderMeta = ToolsFolderMeta;
if (typeof window !== "undefined") window.ToolsFolderMeta = ToolsFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = ToolsFolderMeta;
