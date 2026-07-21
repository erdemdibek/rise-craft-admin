class PublishService {

    constructor() {

        this.changedFiles = new Map();

        this.isPublishing = false;

    }

    addRecipeFile(profession, recipes) {

        this.changedFiles.set(

            `modules/recipes/${profession}.json`,

            structuredClone(recipes)

        );

    }

    hasChanges() {

        return this.changedFiles.size > 0;

    }

    getFiles() {

        return [...this.changedFiles.entries()];

    }

    clear() {

        this.changedFiles.clear();

    }

    async publish() {

        if (this.isPublishing)
            return;

        if (!this.hasChanges()) {

            alert("Publish edilecek değişiklik yok.");

            return;

        }

        this.isPublishing = true;

        try {

            const manifest = await manifestService.load();

            // Önce recipe dosyalarını yükle

            for (const [path, recipes] of this.changedFiles) {

                await githubService.uploadJson(

                    path,

                    recipes,

                    `Update ${path}`

                );

            }

            // Manifest versiyonunu artır

            manifestService.incrementRecipeVersion(

                manifest

            );

            // Manifest'i yükle

            await manifestService.save(

                manifest

            );

            // Draft temizle

            this.changedFiles.forEach((_, path) => {

                const profession = path
                    .replace("modules/recipes/", "")
                    .replace(".json", "");

                state.clearDraft(profession);

            });

            this.clear();

            githubService.clearCache();

            navbar.update();

            alert("Publish başarıyla tamamlandı.");

        }

        catch (e) {

            console.error(e);

            alert(

                "Publish sırasında hata oluştu.\n\n" +

                e.message

            );

        }

        finally {

            this.isPublishing = false;

        }

    }

}

const publishService = new PublishService();