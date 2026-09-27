var ProjectBrowserWebRootOpener = globalThis.ProjectBrowserWebRootOpener || class ProjectBrowserWebRootOpener {
  constructor(app) {
    this.app = app;
  }

  static async openWebRoot(app) {
    const opener = new ProjectBrowserWebRootOpener(app || globalThis.vibesApp);
    return await opener.open();
  }

  async open() {
    console.log('[ProjectBrowserWebRootOpener] Opening native directory picker...');
    const app = this.app || globalThis.vibesApp;

    try {
      if (typeof window !== 'undefined' && window.showDirectoryPicker) {
        const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
        
        if (app && app.projectFilesManager) {
          if (typeof app.projectFilesManager.setDirectoryHandle === 'function') {
            await app.projectFilesManager.setDirectoryHandle(handle);
          }
          if (typeof app.projectFilesManager.loadDirectory === 'function') {
            await app.projectFilesManager.loadDirectory(handle);
          } else if (typeof app.projectFilesManager.refreshTree === 'function') {
            await app.projectFilesManager.refreshTree();
          }
        }
        if (app && app.uiManager && typeof app.uiManager.showToast === 'function') {
          app.uiManager.showToast(`Opened folder: ${handle.name}`, 'success', '📁');
        }
        return handle;
      }
      throw new Error('showDirectoryPicker is not supported in this browser.');
    } catch (err) {
      if (err.name === 'AbortError') return null;
      console.error('[ProjectBrowserWebRootOpener] Folder open error:', err);
      if (app && app.uiManager && typeof app.uiManager.showToast === 'function') {
        app.uiManager.showToast(`Could not open folder: ${err.message}`, 'error', '❌');
      }
      return null;
    }
  }
};

globalThis.ProjectBrowserWebRootOpener = ProjectBrowserWebRootOpener;
if (typeof module !== 'undefined' && module.exports) module.exports = ProjectBrowserWebRootOpener;