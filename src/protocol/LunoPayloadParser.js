class LunoPayloadParser {
  constructor() {}

  static stripMarkdownFences(text) {
    if (!text || typeof text !== 'string') return '';
    var cleaned = text.trim();

    var openFenceMatch = cleaned.match(/^(`{3,}|~{3,})[a-zA-Z0-9_\-]*\r?\n/);
    if (openFenceMatch) {
      cleaned = cleaned.slice(openFenceMatch[0].length).trimEnd();
      var closeFenceMatch = cleaned.match(/\r?\n(`{3,}|~{3,})\s*$/);
      if (closeFenceMatch) {
        cleaned = cleaned.slice(0, cleaned.length - closeFenceMatch[0].length).trimEnd();
      } else if (/^(`{3,}|~{3,})\s*$/.test(cleaned)) {
        cleaned = '';
      }
    }
    return cleaned;
  }

  static getAttrValue(str, attrName) {
    if (!str || !attrName) return '';
    var regex = new RegExp('(?:^|\\s)' + attrName + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i');
    var match = str.match(regex);
    if (match) {
      return match[1] !== undefined ? match[1] : (match[2] !== undefined ? match[2] : (match[3] || ''));
    }
    return '';
  }

  static parse(text) {
    if (!text || typeof text !== 'string') {
      return { files: [], serverScript: '', requests: [], debugLogs: ['Input text is empty'] };
    }

    var files = [];
    var serverScript = '';
    var requests = [];
    var debugLogs = [];
    var pos = 0;
    var len = text.length;

    var SCRIPT_WORD = 'scr' + 'ipt';
    var STYLE_WORD = 'sty' + 'le';
    var TEMPLATE_WORD = 'temp' + 'late';
    var SVG_WORD = 'sv' + 'g';

    while (pos < len) {
      var openIdx = text.indexOf('<', pos);
      if (openIdx === -1) break;

      var isClose = text.substring(openIdx, openIdx + 2) === '</';
      if (isClose) {
        pos = openIdx + 2;
        continue;
      }

      var tagWord = null;
      var rest = text.substring(openIdx + 1);

      if (rest.indexOf(SCRIPT_WORD) === 0) tagWord = SCRIPT_WORD;
      else if (rest.indexOf(STYLE_WORD) === 0) tagWord = STYLE_WORD;
      else if (rest.indexOf(TEMPLATE_WORD) === 0) tagWord = TEMPLATE_WORD;
      else if (rest.indexOf(SVG_WORD) === 0) tagWord = SVG_WORD;

      if (!tagWord) {
        pos = openIdx + 1;
        continue;
      }

      var nextChar = text.charAt(openIdx + 1 + tagWord.length);
      if (nextChar && nextChar !== ' ' && nextChar !== '\t' && nextChar !== '\n' && nextChar !== '\r' && nextChar !== '>') {
        pos = openIdx + 1;
        continue;
      }

      var headerEndIdx = -1;
      var inAttrQuote = false;
      var attrQuoteChar = '';
      for (var h = openIdx + 1 + tagWord.length; h < len; h++) {
        var ch = text.charAt(h);
        if (inAttrQuote) {
          var bkCount = 0;
          var bkIdx = h - 1;
          while (bkIdx >= 0 && text.charAt(bkIdx) === '\\') { bkCount++; bkIdx--; }
          if (ch === attrQuoteChar && (bkCount % 2 === 0)) inAttrQuote = false;
        } else if (ch === '"' || ch === "'") {
          inAttrQuote = true;
          attrQuoteChar = ch;
        } else if (ch === '>') {
          headerEndIdx = h;
          break;
        }
      }

      if (headerEndIdx === -1) break;

      var headerStr = text.substring(openIdx + 1 + tagWord.length, headerEndIdx);
      var closeTag = '</' + tagWord;
      var closeSearchIdx = text.indexOf(closeTag, headerEndIdx + 1);

      if (closeSearchIdx === -1) { pos = headerEndIdx + 1; continue; }
      var closeEndIdx = text.indexOf('>', closeSearchIdx);
      if (closeEndIdx === -1) { pos = headerEndIdx + 1; continue; }

      var innerContent = text.substring(headerEndIdx + 1, closeSearchIdx).trim();

      // Support both data-file and data-path
      var rawFilePath = LunoPayloadParser.getAttrValue(headerStr, 'data-file') || LunoPayloadParser.getAttrValue(headerStr, 'data-path');
      var filePath = rawFilePath ? rawFilePath.replace(/\\/g, '/').replace(/^\/+/, '').trim() : '';

      var methodSpec = LunoPayloadParser.getAttrValue(headerStr, 'data-method');
      var className = LunoPayloadParser.getAttrValue(headerStr, 'data-class');
      var deleteMethod = LunoPayloadParser.getAttrValue(headerStr, 'data-delete-method');
      var action = (LunoPayloadParser.getAttrValue(headerStr, 'data-action') || 'write').toLowerCase();
      var typeAttr = (LunoPayloadParser.getAttrValue(headerStr, 'type') || '').toLowerCase();
      var isServer = LunoPayloadParser.getAttrValue(headerStr, 'data-server') === 'true' || action === 'run-server' || filePath === 'RUN: SERVER';

      if (className && methodSpec && !methodSpec.includes('.')) {
        methodSpec = className + '.' + methodSpec;
      }
      if (deleteMethod) {
        action = 'delete';
        methodSpec = className ? (className + '.' + deleteMethod) : deleteMethod;
      }
      if (methodSpec && !action) {
        action = 'patch';
      }

      if (isServer) {
        serverScript += (serverScript ? '\n\n' : '') + innerContent;
      } else if (typeAttr === 'application/luno-request' || action === 'request') {
        requests.push({ tagName: tagWord, filePath, methodSpec, content: innerContent });
      } else if (filePath && filePath !== '...') {
        files.push({ tagName: tagWord, filePath, methodSpec, action, content: innerContent });
      }

      pos = closeEndIdx + 1;
    }

    return { files, serverScript, requests, debugLogs };
  }

  static parsePatchLog(patchLogHtml) {
    return LunoPayloadParser.parse(patchLogHtml);
  }
}

globalThis.LunoPayloadParser = LunoPayloadParser;
if (typeof module !== 'undefined' && module.exports) module.exports = LunoPayloadParser;