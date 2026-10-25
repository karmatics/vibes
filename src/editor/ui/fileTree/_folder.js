class FileTreeFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/editor/ui/fileTree",
          "capsules": [
                "FileTreeActivityRegistry.js",
                "FileTreeView.js",
                "ProjectFilesManager.js",
                "TreeNode.js"
          ]
    };
  }
}

globalThis.FileTreeFolderMeta = FileTreeFolderMeta;
if (typeof window !== "undefined") window.FileTreeFolderMeta = FileTreeFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = FileTreeFolderMeta;
