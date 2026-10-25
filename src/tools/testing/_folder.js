class TestingFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/tools/testing",
          "capsules": [
                "ReceiveCodeTester.js"
          ]
    };
  }
}

globalThis.TestingFolderMeta = TestingFolderMeta;
if (typeof window !== "undefined") window.TestingFolderMeta = TestingFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = TestingFolderMeta;
