class ManagedManifestLoader {

  constructor(options = {}) {
    this.fetchImpl = options.fetchImpl || (typeof fetch === "function" ? fetch.bind(window) : null);
    this.manifest = null;
    this.sidecars = new Map();
  }

  static async loadManifest(vfs) {
      // 1. Check for modern luno.json first
      try {
        if (vfs && typeof vfs.readFile === 'function') {
          const lunoContent = await vfs.readFile('luno.json');
          if (lunoContent && lunoContent.trim()) {
            return JSON.parse(lunoContent);
          }
        }
      } catch (e) {}

      // 2. Fetch luno.json via standard fetch if VFS did not have it
      try {
        const res = await fetch('/vibes/luno.json');
        if (res.ok) {
          const text = await res.text();
          if (!text.startsWith('<')) {
            return JSON.parse(text);
          }
        }
      } catch (e) {}

      // 3. Fallback to legacy files.json if luno.json is absent
      try {
        if (vfs && typeof vfs.readFile === 'function') {
          const filesContent = await vfs.readFile('files.json');
          if (filesContent && filesContent.trim()) {
            return JSON.parse(filesContent);
          }
        }
      } catch (e) {}

      try {
        const resOld = await fetch('/vibes/files.json');
        if (resOld.ok) return await resOld.json();
      } catch (e) {}

      return { main: ['src/editor/ProjectEditorApp.js'], local: [], library: [] };
    }
  async loadSidecarText(url) {
    if (!this.fetchImpl) throw new Error("No fetch implementation available");
    const res = await this.fetchImpl("/" + url.replace(/^\/+/, ""));
    if (!res.ok) throw new Error(`Failed to load sidecar: ${url}`);
    return await res.text();
  }

  async loadSidecarYaml(url) {
    const text = await this.loadSidecarText(url);
    if (typeof ManagedMetadata !== "undefined" && ManagedMetadata.parseLooseYamlLike) {
      return ManagedMetadata.parseLooseYamlLike(text);
    }
    return { raw: text };
  }

  async warmSidecars() {
    if (!this.manifest) throw new Error("Manifest not loaded");
    const entries = this.getAllEntries();
    for (const entry of entries) {
      if (!entry.sidecar) continue;
      if (this.sidecars.has(entry.sidecar)) continue;
      try {
        const parsed = await this.loadSidecarYaml(entry.sidecar);
        this.sidecars.set(entry.sidecar, parsed);
      } catch (error) {
        console.warn("Failed to warm sidecar", entry.sidecar, error);
      }
    }
  }

  getAllEntries() {
    if (!this.manifest || !Array.isArray(this.manifest.all)) return [];
    return this.manifest.all;
  }

  getGroup(groupName) {
    if (!this.manifest || !this.manifest.groups) return [];
    return this.manifest.groups[groupName] || [];
  }

  getEntryByClassName(className) {
    return this.getAllEntries().find(entry => entry.className === className) || null;
  }

  getEntryByPath(filePath) {
    return this.getAllEntries().find(entry => entry.path === filePath) || null;
  }

  getSidecarData(sidecarPath) {
    return this.sidecars.get(sidecarPath) || null;
  }

  async describeAll() {
    const out = [];
    for (const entry of this.getAllEntries()) {
      const sidecar = entry.sidecar ? (this.sidecars.get(entry.sidecar) || null) : null;
      out.push({ ...entry, sidecarData: sidecar });
    }
    return out;
  }

}

/* recursi-meta
{
  "schema": 1,
  "lines": 86,
  "provides": [],
  "deps": []
}
recursi-meta */


globalThis.ManagedManifestLoader = ManagedManifestLoader;
if (typeof window !== "undefined") window.ManagedManifestLoader = ManagedManifestLoader;
if (typeof module !== "undefined" && module.exports) module.exports = ManagedManifestLoader;
