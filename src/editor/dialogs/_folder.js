class DialogsFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/dialogs",
          "capsules": [
                "FileLogDialog.js"
          ]
    };
  }
}

globalThis.DialogsFolderMeta = DialogsFolderMeta;
if (typeof window !== "undefined") window.DialogsFolderMeta = DialogsFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = DialogsFolderMeta;
