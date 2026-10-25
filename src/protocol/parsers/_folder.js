class ParsersFolderMeta {
  
  
  static _meta_directoryInfo() {
    return {
          "path": "/vibes/src/protocol/parsers",
          "capsules": [
                "AstUtils.js",
                "JsModuleParser.js"
          ]
    };
  }
}

globalThis.ParsersFolderMeta = ParsersFolderMeta;
if (typeof window !== "undefined") window.ParsersFolderMeta = ParsersFolderMeta;
if (typeof module !== "undefined" && module.exports) module.exports = ParsersFolderMeta;
