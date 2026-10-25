class RunnerFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/tools/runner",
          "capsules": [
                "runner-client.js",
                "RunInPageRunner.js",
                "RunnerManager.js"
          ]
    };
  }
}

globalThis.RunnerFolderMeta = RunnerFolderMeta;
if (typeof window !== "undefined") window.RunnerFolderMeta = RunnerFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = RunnerFolderMeta;
