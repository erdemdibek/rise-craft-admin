class ManifestService {

    constructor() {

        this.path = "manifest.json";

    }

    async load(forceRefresh = false) {

        return await githubService.downloadJson(
            this.path,
            forceRefresh
        );

    }

    async save(manifest) {

        return await githubService.uploadJson(

            this.path,

            manifest,

            `Update manifest v${manifest.contentVersion}`

        );

    }

    incrementRecipeVersion(manifest) {

        manifest.contentVersion++;

        manifest.modules.recipes.version++;

        return manifest;

    }

    incrementMaterialVersion(manifest) {

        manifest.contentVersion++;

        manifest.modules.materials.version++;

        return manifest;

    }

}

const manifestService = new ManifestService();