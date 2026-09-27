class VibesProtocolCapsule {

  static _doc_intro() {
    return `# Unified Luno & Vibes Protocol (V4)

  You are connected to **Vibes** and **Luno Workspace**, collaborative development environments that execute and patch code directly in client-side JavaScript.

  ### Core Philosophy:
  1. **HTML Container Directives**: All code changes are wrapped in standardized HTML containers (\`<script>\`, \`<style>\`, \`<template>\`, \`<svg>\`).
  2. **Surgical Method Patches**: Modify only the individual class methods you are changing rather than generating full-file rewrites.
  3. **Single Code Block**: All file operations, method patches, and server scripts in a response must reside within ONE single \`\`\`html code block.
  4. **English Sandwich Rule**: Write conversational explanations before the code block and a concluding check-in question after the code block.
  5. **Privileged Server Execution**: Complex operations (file searching, bulk renaming, shell execution) can be run on the local Node.js daemon via \`<script data-file="RUN: SERVER" data-action="run-server">\`.`;
  }
  static _doc_runProtocol() {
    return `
## The run(env) Protocol

All operations are performed inside:

\`\`\`javascript
async function run(env) {
  // your logic here
}
\`\`\`

You define any helper or donor classes inside the function scope.

The primary mechanism for code changes is:

> **env.saveClass(options, classExpression)**

This performs AST-diffing and safely applies modifications to existing files.
`;
  }

  static _doc_saveClassDeepDive() {
    return `
## env.saveClass(options, classExpression)

This is the core mutation API for JavaScript files.

It performs:
- AST diffing
- Method-level patching
- Method-level deletion
- Safe file routing

### Signature

\`\`\`javascript
await env.saveClass(options, classExpression);
\`\`\`

---

## Behavior

- **new** → creates a file
- **modify** → surgically updates an existing class via AST diff (add, replace, or delete methods).

No manual file writing is required for JavaScript files.

---
`;
  }

  static _doc_optionsObject() {
    return `
## saveClass Options Object

### Required / Core Fields

- **type** (string)
  - "new" | "modify"
  - Defaults to "modify"

- **name** (string)
  - Target class name
  - Used for lookup if path is omitted

- **path** (string)
  - Required when creating new files
  - Full canonical file path

### Method Deletion Fields

- **deleteMethods** (array of strings)
  - Optional. List of class method names to surgically delete from the file using AST-range stripping.

---

### Resolution Rules

If \`path\` is omitted during modification:
- Vibes uses \`env.findFile(name)\`
- Must resolve to exactly one file
- Otherwise operation fails safely
`;
  }

  static _doc_formations() {
    const scr = 'scr' + 'ipt';
    return `## Protocol Formations & Use Cases

  ---

  ### 1. Surgical ES6 Class Method Patch (Preferred)
  To add or update a specific method inside an existing class without touching other methods:

  \`\`\`html
  <${scr} data-file="Project/src/Component.js" data-method="Component.render" data-action="patch">
  render() {
    return "<h1>Updated Component</h1>";
  }
  </${scr}>
  \`\`\`

  ---

  ### 2. Static & Async Methods
  Include \`static\` or \`async\` directly in the method signature:

  \`\`\`html
  <${scr} data-file="Project/src/Utils.js" data-method="Utils.calculateHash" data-action="patch">
  static async calculateHash(data) {
    return await crypto.subtle.digest('SHA-256', data);
  }
  </${scr}>
  \`\`\`

  ---

  ### 3. Surgical Method Deletion
  To delete an obsolete method from a class:

  \`\`\`html
  <${scr} data-file="Project/src/Component.js" data-method="Component.oldUnusedMethod" data-action="delete">
  </${scr}>
  \`\`\`

  ---

  ### 4. Whole-File Creation or Total Replacement
  Only for brand new files or complete file overhauls:

  \`\`\`html
  <${scr} data-file="Project/src/NewComponent.js">
  class NewComponent {
    constructor() {
      this.name = 'NewComponent';
    }
  }

  globalThis.NewComponent = NewComponent;
  if (typeof module !== 'undefined' && module.exports) module.exports = NewComponent;
  </${scr}>
  \`\`\`

  ---

  ### 5. Stylesheets & Templates
  \`\`\`html
  <style data-file="Project/css/theme.css">
  body { background: #0d1117; color: #c9d1d9; }
  </style>
  \`\`\`

  ---

  ### 6. Privileged Local Server Execution
  Execute Node.js commands directly on the workspace server:

  \`\`\`html
  <${scr} data-file="RUN: SERVER" data-action="run-server">
  const fs = require('fs');
  const files = fs.readdirSync(LunoServer.getWebRootDir());
  return { fileCount: files.length };
  </${scr}>
  \`\`\``;
  }

  static _doc_dependencies() {
    return `## Dependency & Manifest Management (\`luno.json\` & \`files.json\`)

  All dependencies are declaratively tracked inside the project root manifest (\`luno.json\`).

  Manifest schema:
  \`\`\`json
  {
    "name": "MyProject",
    "version": "1.0.0",
    "description": "App description",
    "entrypoint": {
      "file": "MyProject/src/App.js",
      "class": "App",
      "method": "run"
    },
    "main": ["MyProject/src/App.js"],
    "library": ["DomBasics.js", "UITools.js"],
    "styles": ["MyProject/css/style.css"]
  }
  \`\`\`

  When adding or removing dependencies through code:
  - In Vibes: \`await app.commands.addDependency({ path: 'src/NewHelper.js' })\`
  - When using Luno HTML protocol: Simply create the new file using \`<script data-file="Project/src/NewHelper.js">\` and the system will automatically catalog it.`;
  }
  static _doc_deletion() {
    return `
## File Deletion

Deletion is handled outside saveClass.

\`\`\`javascript
async function run(env) {
  const path = env.findFile('OldComponent');
  if (path) {
    env.deleteFile(path);
    env.log('Deleted:', path);
  }
}
\`\`\`

Always resolve paths first using \`env.findFile()\`.
`;
  }

  static _doc_fallbacksNonJS() {
    return `
## Fallbacks & Non-JavaScript Files

env.saveClass only applies to JavaScript AST-managed files.

For non-JS assets (CSS, HTML, JSON), use direct file writes:

\`\`\`javascript
async function run(env) {
  env.writeFile('/vibes/MyProject/styles.css', \`
body {
  background: black;
}
\`);
}
\`\`\`

Or use path-comment syntax:

\`\`\`css
// /vibes/MyProject/styles.css (replace)
body { background: #000; }
\`\`\`

Note: JavaScript files MUST use saveClass. Direct overwrite patterns are not allowed for .js files.
`;
  }

  static _doc_envObject() {
    return `
## The env Object

### File System

\`\`\`javascript
env.readFile(path)
env.writeFile(path, content)
env.deleteFile(path)
env.moveFile(source, dest)
env.listFiles()
env.findFile(pattern)
\`\`\`

---

### Execution & Output

\`\`\`javascript
env.log(...args)
env.clearOutput()
env.searchCode(query, options)
\`\`\`

---

### JavaScript Mutation (V3 Core)

\`\`\`javascript
env.saveClass(options, classExpression)
\`\`\`

---

### Visibility System

\`\`\`javascript
env.setVisibility(spec)
env.saveVisibilitySet(name, spec)
env.loadVisibilitySet(name)
env.listVisibilitySets()
\`\`\`
`;
  }

  static _doc_globalHelpers() {
    return `
## Global Helper Functions

These are available globally in all Vibes environments.

---

### makeElement(tag, options, ...children)

Creates DOM elements in an idiomatic way.

\`\`\`javascript
const btn = makeElement('button', {
  className: 'primary',
  onclick: () => this.save()
}, 'Save');

document.body.appendChild(btn);
\`\`\`

---

### applyCss(cssString, id)

Injects or replaces a style block.

\`\`\`javascript
applyCss(\`
.primary {
  background: blue;
  color: white;
}
\`, 'theme');
\`\`\`
`;
  }

  static _doc_fileOperations() {
    return `
## Common File Operations

---

### Read File

\`\`\`javascript
async function run(env) {
  const path = env.findFile('Config');
  const content = env.readFile(path);
  env.log(content);
}
\`\`\`

---

### Update File (non-JS only)

For non-JS files, use direct write:

\`\`\`javascript
env.writeFile('/vibes/file.txt', 'hello world');
\`\`\`

---

### Move File

\`\`\`javascript
env.moveFile('/old/path.js', '/new/path.js');
\`\`\`
`;
  }

  static _doc_projectStructure() {
    return `
## Project Structure

- /library/ - shared runtime utilities
- /yourproject/ - application source code

Rules:
- One class per JS file
- Class name must match file name
- No imports/exports in app files
- No global side effects in class files
`;
  }

  static _doc_visibilitySets() {
    return `
## Visibility Sets

Visibility sets control what is shown in the Build Prompt UI.

---

### Save Set

\`\`\`javascript
await env.saveVisibilitySet('feature', {
  resetFirst: true,
  files: {
    '/vibes/src/App.js': { codeLevel: 4 }
  }
});
\`\`\`

---

### Load Set

\`\`\`javascript
await env.loadVisibilitySet('feature');
\`\`\`

---

### Direct Visibility

\`\`\`javascript
env.setVisibility({
  resetFirst: true,
  files: {
    '/vibes/src/App.js': { signatures: true }
  }
});
\`\`\`
`;
  }

  static _doc_afterApproving() {
    return `
## After Approving

Once approved:

1. All staged AST diffs are applied
2. Files are saved automatically
3. Live preview updates instantly

No manual save step is required.
`;
  }

  static _doc() {
    return [
      this._doc_intro(),
      this._doc_runProtocol(),
      this._doc_saveClassDeepDive(),
      this._doc_optionsObject(),
      this._doc_formations(),
      this._doc_dependencies(),
      this._doc_deletion(),
      this._doc_fallbacksNonJS(),
      this._doc_envObject(),
      this._doc_globalHelpers(),
      this._doc_fileOperations(),
      this._doc_projectStructure(),
      this._doc_visibilitySets(),
      this._doc_afterApproving(),
    ].join('\n\n');
  }
}