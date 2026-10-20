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
      const knownSiblings = [
        'Luno',
        'LunoParser',
        'LunoTests',
        'Library',
        'Basic3D',
        'BasicsWithDialogBox',
        'SvgStudio',
        'Es6Converter',
        'BookmarkletWorkshop',
        'MathStorm',
        'Calculator',
        'accuCad',
        'situation',
        'AardvarkPlaylist'
      ];
      return knownSiblings.includes(firstSegment);
    }
  async execute(payloadText) {
      if (!payloadText || typeof payloadText !== 'string' || !payloadText.trim()) {
        return { success: false, error: 'Empty payload provided.' };
      }

      const app = this.app || globalThis.vibesApp;
      const vfs = app && (app.vfs || app.virtualFileSystem);

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

      for (const f of files) {
        if (this.isSiblingProjectFile(f.filePath)) {
          siblingFiles.push(f);
          summary.push({ path: f.filePath, mode: 'sibling-project', success: true });
          continue;
        }

        const localPath = this.normalizeTargetFile(f.filePath);
        const isSurgicalPatch = Boolean(f.methodSpec || f.action === 'patch' || f.action === 'delete');

        let finalContent = f.content || '';

        if (isSurgicalPatch) {
          let existingContent = '';
          if (vfs && typeof vfs.readFile === 'function') {
            try {
              existingContent = await vfs.readFile(localPath);
            } catch (e) {
              try {
                existingContent = await vfs.readFile('vibes/' + localPath);
              } catch (e2) {}
            }
          } else if (app && app.inMemoryFileStore && app.inMemoryFileStore.has(localPath)) {
            existingContent = app.inMemoryFileStore.get(localPath);
          }

          if (!existingContent || !existingContent.trim()) {
            throw new Error('[LunoProtocolExecutor] Cannot patch member "' + (f.methodSpec || localPath) + '": Base file "' + localPath + '" not found.');
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

      let localSavedCount = 0;
      for (const mut of localMutations) {
        try {
          if (vfs && typeof vfs.writeFile === 'function') {
            await vfs.writeFile(mut.path, mut.content);
          }
          if (app && app.inMemoryFileStore) {
            app.inMemoryFileStore.set(mut.path, mut.content);
          }
          localSavedCount++;
        } catch (writeErr) {
          console.error('[LunoProtocolExecutor] Write failed for ' + mut.path, writeErr);
        }
      }

      let siblingSavedCount = 0;
      if (siblingFiles.length > 0 || serverScript) {
        try {
          if (typeof LunoApiClient !== 'undefined' && LunoApiClient.savePayload) {
            const proxyData = await LunoApiClient.savePayload({ files: siblingFiles, serverScript: serverScript });
            siblingSavedCount = (proxyData && proxyData.modifiedCount) || siblingFiles.length;
          }
        } catch (proxyErr) {
          console.warn('[LunoProtocolExecutor] Sibling save notice:', proxyErr.message);
        }
      }

      const totalModified = localSavedCount + siblingSavedCount;
      const msg = `Applied ${localSavedCount} file(s) in Vibes` + (siblingSavedCount > 0 ? ` + ${siblingSavedCount} sibling file(s).` : '.');

      if (app && app.uiManager && typeof app.uiManager.setStatus === 'function') {
        app.uiManager.setStatus(msg, false, 4000);
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