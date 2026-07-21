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

        if (typeof navbar !== "undefined") {

            navbar.update();

        }

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

        if (this.isPublishing) {

            return;

        }

        if (!this.hasChanges()) {

            alert("Publish edilecek değişiklik bulunmuyor.");

            return;

        }

        this.isPublishing = true;

        if (typeof navbar !== "undefined") {

            navbar.setLoading(true);

        }

        try {

            const manifest = await manifestService.load();

            for (const [path, recipes] of this.changedFiles) {

                console.log("Uploading:", path);

                await githubService.uploadJson(

                    path,

                    recipes,

                    `Update ${path}`

                );

            }

            manifestService.incrementRecipeVersion(manifest);

            await manifestService.save(manifest);

            this.changedFiles.forEach((_, path) => {

                const profession = path
                    .replace("modules/recipes/", "")
                    .replace(".json", "");

                state.clearDraft(profession);

            });

            this.clear();

            githubService.clearCache();

            if (typeof navbar !== "undefined") {

                navbar.update();

            }

            alert("Publish başarıyla tamamlandı.");

        }

        catch (e) {

            console.error(e);

            alert(

                "Publish sırasında hata oluştu.\n\n" +

                (e.message || e)

            );

        }

        finally {

            this.isPublishing = false;

            if (typeof navbar !== "undefined") {

                navbar.setLoading(false);

            }

        }

    }

}

const publishService = new PublishService();