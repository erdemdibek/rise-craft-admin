class ManifestService {
    constructor() {
        this.path = "manifest.json";
    }

    /**
     * Manifest dosyasını yükler.
     */
    async load(forceRefresh = false) {
        try {
            const data = await githubService.downloadJson(this.path, forceRefresh);
            if (data) {
                return this.ensureStructure(data);
            }
        } catch (error) {
            console.warn("Manifest okunamadı, varsayılan yapı kuruluyor:", error);
        }

        return this.getDefaultManifest();
    }

    /**
     * Manifest dosyasını hazırlar ve GitHub'a yükler.
     */
    async save(manifest) {
        if (!manifest) {
            throw new Error("Kaydedilecek manifest bulunamadı.");
        }

        const validManifest = this.ensureStructure(manifest);
        const version = validManifest.contentVersion || 1;

        return await githubService.uploadJson(
            this.path,
            validManifest,
            `Update manifest v${version}`
        );
    }

    /**
     * Reçete versiyonunu ve genel İçerik versiyonunu artırır.
     */
    incrementRecipeVersion(manifest) {
        const m = this.ensureStructure(manifest);
        
        m.contentVersion = (m.contentVersion || 0) + 1;
        m.modules.recipes.version = (m.modules.recipes.version || 0) + 1;

        return m;
    }

    /**
     * Materyal versiyonunu ve genel İçerik versiyonunu artırır.
     */
    incrementMaterialVersion(manifest) {
        const m = this.ensureStructure(manifest);

        m.contentVersion = (m.contentVersion || 0) + 1;
        m.modules.materials.version = (m.modules.materials.version || 0) + 1;

        return m;
    }

    /**
     * Gelen JSON yapısının mevcut manifest.json şablonuna %100 uymasını sağlar.
     */
    ensureStructure(manifest) {
        const base = manifest || {};

        base.contentVersion = base.contentVersion || 1;
        base.minimumAppVersion = base.minimumAppVersion || 1;
        base.latestAppVersion = base.latestAppVersion || 1;

        base.modules = base.modules || {};

        // Recipes modülü kontrolü
        base.modules.recipes = base.modules.recipes || {};
        base.modules.recipes.version = base.modules.recipes.version || 1;
        base.modules.recipes.path = base.modules.recipes.path || "modules/recipes/";

        // Materials modülü kontrolü
        base.modules.materials = base.modules.materials || {};
        base.modules.materials.version = base.modules.materials.version || 1;
        base.modules.materials.file = base.modules.materials.file || "modules/materials.json";

        return base;
    }

    /**
     * Senkronizasyon için varsayılan manifest şablonun
     */
    getDefaultManifest() {
        return {
            contentVersion: 1,
            minimumAppVersion: 1,
            latestAppVersion: 1,
            modules: {
                recipes: {
                    version: 1,
                    path: "modules/recipes/"
                },
                materials: {
                    version: 1,
                    file: "modules/materials.json"
                }
            }
        };
    }
}

const manifestService = new ManifestService();
