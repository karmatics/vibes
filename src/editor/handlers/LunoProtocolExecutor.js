class LunoProtocolExecutor {
  constructor(app) {
    this.app = app;
  }

  static async execute(payloadText, app) {
    const executor = new LunoProtocolExecutor(app);
    return await executor.execute(payloadText);
  }

  /**
   * Normalizes incoming container paths to work both inside Vibes (root mounted to vibes)
   * and in multi-project environments.
   */
  normalizeTargetFile(rawPath) {
    if (!rawPath || typeof rawPath !== 'string') return '';
    let clean = rawPath.replace(/\\/g, '/').replace(/^\/+/, '').trim();
    if (clean.startsWith('./')) clean = clean.slice(2).trim();

    // If the path starts with 'vibes/', strip it when running inside the Vibes project
    if (clean.startsWith('vibes/')) {
      clean = clean.slice(6).trim();
    }
    return clean;
  }

  isSiblingProjectFile(rawPath) {
    if (!rawPath || typeof rawPath !== 'string') return false;
    const clean = rawPath.replace(/\\/g, '/').replace(/^\/+/, '').trim();
    const firstSegment = clean.split('/')[0];
    const knownSiblings = ['Luno', 'LunoTests', 'Library', 'Basic3D', 'BasicsWithDialogBox', 'SvgStudio', 'Es6Converter', 'BookmarkletWorkshop'];
    return knownSiblings.includes(firstSegment);
  }

  async execute(payloadText) {
    if (!payloadText || typeof payloadText !== 'string' || !payloadText.trim()) {
      return { success: false, error: 'Empty payload provided.' };
    }

    const app = this.app || globalThis.vibesApp;
    const vfs = app && (app.vfs || app.virtualFileSystem);

    // 1. Tokenize using ported LunoPayloadParser
    const parser = globalThis.LunoPayloadParser;
    if (!parser || typeof parser.parse !== 'function') {
      throw new Error('[LunoProtocolExecutor] LunoPayloadParser is not available in global scope.');
    }

    const parsed = parser.parse(payloadText);
    const files = parsed.files || [];
    const serverScript = parsed.serverScript || '';
    const hasContainers = files.length > 0 || Boolean(serverScript);

    if (!hasContainers) {
      return {
        success: false,
        error: 'No valid HTML containers (<script>, <style>, <template>, <svg>) were detected in payload.'
      };
    }

    const localMutations = [];
    const siblingFiles = [];
    const summary = [];

    // 2. Separate local Vibes mutations from external sibling project files
    for (const f of files) {
      if (this.isSiblingProjectFile(f.filePath)) {
        siblingFiles.push(f);
        summary.push({ path: f.filePath, mode: 'sibling-proxy-save', success: true });
        continue;
      }

      const localPath = this.normalizeTargetFile(f.filePath);
      const isSurgicalPatch = Boolean(f.methodSpec || f.action === 'patch' || f.action === 'delete');

      let finalContent = f.content || '';

      if (isSurgicalPatch) {
        if (!vfs) {
          throw new Error('[LunoProtocolExecutor] VFS unavailable to retrieve base file for surgical patch: ' + localPath);
        }

        let existingContent = '';
        try {
          existingContent = await vfs.readFile(localPath);
        } catch (e) {
          try {
            existingContent = await vfs.readFile('vibes/' + localPath);
          } catch (e2) {}
        }

        if (!existingContent || !existingContent.trim()) {
          throw new Error('[LunoProtocolExecutor] Cannot patch member "' + (f.methodSpec || localPath) + '": Base file "' + localPath + '" not found in Vibes VFS.');
        }

        const patcher = globalThis.LunoClassPatcher || globalThis.ClientJSClassPatcher;
        if (!patcher) {
          throw new Error('[LunoProtocolExecutor] AST Patcher unavailable in client runtime.');
        }

        if (f.action === 'delete') {
          finalContent = patcher.deleteMethodInSource(existingContent, f.methodSpec || localPath);
        } else {
          finalContent = patcher.patchMethodInSource(existingContent, f.methodSpec || localPath, f.content, { allowInsert: true });
        }

        summary.push({ path: localPath, target: f.methodSpec, mode: 'surgical-patch', success: true });
      } else {
        summary.push({ path: localPath, mode: 'full-file', success: true });
      }

      localMutations.push({
        path: localPath,
        content: finalContent,
        originalFile: f
      });
    }

    // 3. Apply local mutations directly to Vibes VFS
    let localSavedCount = 0;
    if (vfs && localMutations.length > 0) {
      for (const mut of localMutations) {
        try {
          await vfs.writeFile(mut.path, mut.content);
          localSavedCount++;
        } catch (writeErr) {
          console.error('[LunoProtocolExecutor] Local write failed for ' + mut.path, writeErr);
          throw writeErr;
        }
      }
    }

    // 4. Proxy sibling project files and privileged server scripts to Luno daemon (port 8080)
    let siblingSavedCount = 0;
    if (siblingFiles.length > 0 || serverScript) {
      try {
        const proxyPayload = {
          files: siblingFiles,
          serverScript: serverScript
        };

        const res = await fetch('http://127.0.0.1:8080/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Luno-Client': '1' },
          body: JSON.stringify(proxyPayload)
        });

        if (res.ok) {
          const proxyData = await res.json();
          siblingSavedCount = proxyData.count || siblingFiles.length;
        }
      } catch (proxyErr) {
        console.warn('[LunoProtocolExecutor] Daemon proxy notice (port 8080 offline or unlinked):', proxyErr.message);
      }
    }

    const totalModified = localSavedCount + siblingSavedCount;
    const msg = `Applied ${localSavedCount} file(s) locally in Vibes` + (siblingSavedCount > 0 ? ` + ${siblingSavedCount} sibling file(s) via Luno daemon.` : '.');

    if (app && app.uiManager && typeof app.uiManager.showToast === 'function') {
      app.uiManager.showToast(msg, 'success');
    } else {
      console.log('[LunoProtocolExecutor] ' + msg);
    }

    return {
      success: true,
      modifiedCount: totalModified,
      summary: summary,
      message: msg
    };
  }

  static detectFileReplace(text) {
      return UnifiedProtocolExecutor.detectFileReplace(text);
    }

  static detectClassReplace(text) {
      return UnifiedProtocolExecutor.detectClassReplace(text);
    }
}

globalThis.LunoProtocolExecutor = LunoProtocolExecutor;
if (typeof module !== 'undefined' && module.exports) module.exports = LunoProtocolExecutor;