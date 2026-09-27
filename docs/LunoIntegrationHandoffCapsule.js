class LunoIntegrationHandoffCapsule {

  static _doc() {
    return [
      this._doc_overview(),
      this._doc_lunoIntegrationPlan(),
      this._doc_crossProjectRouting()
    ].join('\n\n---\n\n');
  }

  static _doc_overview() {
    return `# Luno ↔ Vibes Architecture & Unified Handoff Capsule

## Purpose
This capsule provides the technical specification for the unified **Luno** and **Vibes** desktop and mobile development architecture.

### Core Philosophy
1. **Pure Class Constraint**: 1 File = 1 Class = Same Name. Everything resolves across the shared global lexical scope.
2. **HTML Container Directives**: Code edits arrive as declarative HTML tags with explicit attributes (data-file, data-method, data-action).
3. **Desktop Visual Diffing**: Incoming patches in Vibes are inspected visually in PasteReviewDialog before permanent commitment.
4. **Remote Server Daemon**: Headless server operations route to the active LunoServer process on port 8080.
5. **Universal Manifest**: Projects declare entrypoints, dependencies, and styles inside luno.json.`;
  }

  static _doc_lunoIntegrationPlan() {
    return `## 7. Luno ↔ Vibes Integration Blueprint (Status: Operational)

### Operational Milestones:
1. **Unified HTML Container Protocol**: Both Vibes and Luno accept <script data-file="..." data-method="..."> tags.
2. **Cross-Port Server Execution**: Vibes dispatches RUN: SERVER scripts to the Luno daemon at http://127.0.0.1:8080/api/save with full CORS negotiation.
3. **Workspace Root Consolidation**: Vibes is promoted as a first-class sibling project via /Users/rob/source/LunoProjects/vibes.
4. **Shared Library**: 58 shared runtime modules in /Users/rob/source/LunoProjects/Library are shared across all tools.`;
  }

  static _doc_crossProjectRouting() {
    return `## 8. Cross-Project Routing & Universal File Resolution

Both Luno and Vibes now share deterministic cross-project resolution:
1. When a patch specifies data-file="vibes/...", LunoApiClient automatically routes to the vibes sibling directory.
2. When Vibes receives a patch targeting vibes/... or Luno/..., it resolves the golden path through VFS.
3. Server scripts (RUN: SERVER) execute in the context of the requested project root while retaining access to the parent LunoProjects web root.`;
  }

  static _doc_verificationStatus() {
    return `## 9. Verification & Live Status
  - **HTML Container Protocol**: Verified functional across Luno and Vibes.
  - **Cross-Port Server Execution**: Verified functional from Vibes to Luno daemon on port 8080.
  - **Physical Disk Integration**: /Users/rob/source/LunoProjects/vibes verified with direct read/write access.
  - **Manifest Synchronization**: luno.json active and mapped.`;
  }
}

globalThis.LunoIntegrationHandoffCapsule = LunoIntegrationHandoffCapsule;
if (typeof module !== 'undefined' && module.exports) module.exports = LunoIntegrationHandoffCapsule;