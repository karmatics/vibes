class PlaygroundFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/playground",
          "capsules": [
                "RepoAstAuditWalkSkill.js",
                "PlaygroundController.js",
                "RepoMethodSearchWalkSkill.js",
                "Hiliter.js",
                "ScreenCapTool.js",
                "TreeWalkerPlaygroundScripts.js",
                "SystemMonitorWidget.js",
                "VibesPlaygroundDirector.js"
          ]
    };
  }
}

globalThis.PlaygroundFolderMeta = PlaygroundFolderMeta;
if (typeof window !== "undefined") window.PlaygroundFolderMeta = PlaygroundFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = PlaygroundFolderMeta;
