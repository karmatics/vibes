class DialogsFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/ui/dialogs",
          "capsules": [
                "HotPatchManagerDialog.js",
                "LibraryManagerDialog.js",
                "UndoTimelineDialog.js",
                "PasteReviewDialog.js"
          ]
    };
  }
}

globalThis.DialogsFolderMeta = DialogsFolderMeta;
if (typeof window !== "undefined") window.DialogsFolderMeta = DialogsFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = DialogsFolderMeta;
