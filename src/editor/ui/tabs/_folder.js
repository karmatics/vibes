class TabsFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/ui/tabs",
          "capsules": [
                "TabManager.js"
          ]
    };
  }
}

globalThis.TabsFolderMeta = TabsFolderMeta;
if (typeof window !== "undefined") window.TabsFolderMeta = TabsFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = TabsFolderMeta;
