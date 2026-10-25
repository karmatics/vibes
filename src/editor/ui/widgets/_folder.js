class WidgetsFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/ui/widgets",
          "capsules": [
                "PaintSelectionPanel.js",
                "RecursiLogo.js",
                "VisibilityWidget.js"
          ]
    };
  }
}

globalThis.WidgetsFolderMeta = WidgetsFolderMeta;
if (typeof window !== "undefined") window.WidgetsFolderMeta = WidgetsFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = WidgetsFolderMeta;
