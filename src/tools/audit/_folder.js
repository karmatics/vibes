class AuditFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/tools/audit",
          "capsules": [
                "WriteAuditViewerApp.js"
          ]
    };
  }
}

globalThis.AuditFolderMeta = AuditFolderMeta;
if (typeof window !== "undefined") window.AuditFolderMeta = AuditFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = AuditFolderMeta;
