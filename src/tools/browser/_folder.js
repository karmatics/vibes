class BrowserFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/tools/browser",
          "capsules": [
                "ProjectBrowser.js",
                "ProjectData.js",
                "ProjectCatalogCapsule.js"
          ]
    };
  }
}

globalThis.BrowserFolderMeta = BrowserFolderMeta;
if (typeof window !== "undefined") window.BrowserFolderMeta = BrowserFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = BrowserFolderMeta;
