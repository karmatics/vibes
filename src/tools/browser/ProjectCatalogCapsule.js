// Neutralized catalog capsule: returns empty catalog to stop all thumbnail image network requests
class ProjectCatalogCapsule {
  static getProjects() {
    return [];
  }
  static getCatalog() {
    return [];
  }
}

globalThis.ProjectCatalogCapsule = ProjectCatalogCapsule;
if (typeof module !== 'undefined' && module.exports) module.exports = ProjectCatalogCapsule;