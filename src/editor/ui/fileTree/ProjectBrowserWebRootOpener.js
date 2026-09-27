class ProjectBrowserWebRootOpener {
  constructor(options = {}) {
    if (options && options.manager) {
      this.manager = options.manager;
      this.app = options.manager.app || globalThis.vibesApp || window._dev_projectEditorInstance;
    } else {
      this.app = options || globalThis.vibesApp || window._dev_projectEditorInstance;
      this.manager = this.app?.projectFilesManager || null;
    }
  }

  static async openWebRoot(app) {
    const opener = new ProjectBrowserWebRootOpener(app || globalThis.vibesApp || window._dev_projectEditorInstance);
    return await opener.open();
  }

  async openBrowserWebRootFromPicker(options = {}) {
    return await this.open(options);
  }

  async open(options = {}) {
    console.log('[ProjectBrowserWebRootOpener] Opening native directory picker...');
    const app = this.app || globalThis.vibesApp || window._dev_projectEditorInstance;
    const manager = this.manager || app?.projectFilesManager;
    const launcher = manager?.breakdownHelpers?.floatingTreeLauncher 
      || (typeof ProjectFloatingTreeLauncher !== 'undefined' ? new ProjectFloatingTreeLauncher({ manager }) : null);

    try {
      if (typeof window !== 'undefined' && window.showDirectoryPicker) {
        const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
        if (!handle) return { ok: false, cancelled: true };

        if (app) app.browserWebRootHandle = handle;
        if (manager) manager.browserWebRootHandle = handle;

        const subfolders = launcher && typeof launcher._listBrowserWebRootSubfolders === 'function'
          ? (await launcher._listBrowserWebRootSubfolders(handle)).map(f => f.name)
          : [];

        const lowerName = handle.name.toLowerCase();
        const isWebRoot = subfolders.includes('vibes') || subfolders.includes('Luno') || subfolders.includes('Library') || lowerName.includes('lunoproject') || lowerName === 'web';

        if (isWebRoot || subfolders.length > 2) {
          // Clean up redundant root if previously mounted
          const redundantRootId = '/' + handle.name;
          if (app.workspaceFileStores && app.workspaceFileStores.has(redundantRootId)) {
            app.workspaceFileStores.delete(redundantRootId);
            if (manager?.floatingFileTreeState?.trees?.has(redundantRootId)) {
              const info = manager.floatingFileTreeState.trees.get(redundantRootId);
              if (info?.host?.close) info.host.close();
              manager.floatingFileTreeState.trees.delete(redundantRootId);
            }
          }

          if (launcher) {
            launcher.openFloatingExternalFileTreeLauncher(manager);
            launcher._handleAddDirectoryClick(manager);
          }

          if (app?.uiManager && typeof app.uiManager.showToast === 'function') {
            app.uiManager.showToast(`Connected [${handle.name}]. Choose a subdirectory to open.`, 'info', '📂');
          }
          return { ok: true, handle, isWebRoot: true };
        }

        // Single project folder chosen
        const rootName = handle.name;
        const rootId = '/' + rootName;
        const StoreClass = globalThis.LocalDirectoryStore || window.LocalDirectoryStore;
        if (StoreClass) {
          const store = await StoreClass.open(handle, rootName);
          if (app) {
            if (!app.workspaceFileStores) app.workspaceFileStores = new Map();
            app.workspaceFileStores.set(rootId, store);
          }
          if (manager && typeof manager.openFloatingTreeForStore === 'function') {
            manager.openFloatingTreeForStore(rootId, store);
          }
        }
        if (launcher) {
          launcher.renderFloatingFileTreeLauncher(manager);
        }
        return { ok: true, handle };
      }
      throw new Error('showDirectoryPicker is not supported in this browser.');
    } catch (err) {
      if (err.name === 'AbortError') return { ok: false, cancelled: true };
      console.error('[ProjectBrowserWebRootOpener] Folder open error:', err);
      if (app?.uiManager && typeof app.uiManager.showToast === 'function') {
        app.uiManager.showToast(`Could not open folder: ${err.message}`, 'error', '❌');
      }
      return { ok: false, reason: err.message };
    }
  }
}

globalThis.ProjectBrowserWebRootOpener = ProjectBrowserWebRootOpener;
if (typeof window !== 'undefined') window.ProjectBrowserWebRootOpener = ProjectBrowserWebRootOpener;
if (typeof module !== 'undefined' && module.exports) module.exports = ProjectBrowserWebRootOpener;