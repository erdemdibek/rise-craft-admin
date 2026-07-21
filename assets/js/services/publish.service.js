class PublishService {
    constructor() {
        this.isPublishing = false;
    }

    /**
     * Bir mesleğin reçetelerini taslağa kaydeder ve state'e bildirir.
     */
    addRecipeFile(profession, recipes) {
        if (!profession) return;

        // State tarafına taslak olarak kaydet (LocalStorage desteği var)
        state.saveDraft(profession, recipes);

        this.notifyUI();
    }

    /**
     * Bekleyen taslak değişikliklerinin varlığını kontrol eder.
     */
    hasChanges() {
        return state.getTotalDraftCount() > 0;
    }

    /**
     * Bekleyen tüm taslak dosyalarını GitHub path'i ile hazırlar.
     */
    getFiles() {
        const drafts = state.drafts || {};
        return Object.entries(drafts).map(([profession, recipes]) => [
            `modules/recipes/${profession}.json`,
            recipes
        ]);
    }

    /**
     * Tüm taslakları temizler.
     */
    clear() {
        state.clearAllDrafts();
        this.notifyUI();
    }

    /**
     * Arayüz bileşenlerini günceller.
     */
    notifyUI() {
        if (typeof navbar !== "undefined" && navbar.update) {
            navbar.update();
        }
        if (typeof updatePublishQueueUI === "function") {
            updatePublishQueueUI();
        }
    }

    /**
     * Tüm taslakları GitHub'a commit eder ve Manifest versiyonunu yükseltir.
     */
    async publish() {
        if (this.isPublishing) return;

        if (!this.hasChanges()) {
            alert("Publish edilecek değişiklik bulunmuyor.");
            return;
        }

        const filesToUpload = this.getFiles();
        const confirmPublish = confirm(`${filesToUpload.length} adet dosya GitHub'a yüklenecek. Onaylıyor musunuz?`);
        if (!confirmPublish) return;

        this.isPublishing = true;

        if (typeof navbar !== "undefined" && navbar.setLoading) {
            navbar.setLoading(true);
        }

        try {
            // 1. Dosyaları GitHub'a yükle
            for (const [path, recipes] of filesToUpload) {
                console.log("Uploading:", path);
                await githubService.uploadJson(
                    path,
                    recipes,
                    `Update ${path}`
                );
            }

            // 2. Manifest'i güncelle ve kaydet
            if (typeof manifestService !== "undefined") {
                const manifest = await manifestService.load(true); // Güncelini çek
                
                if (manifestService.incrementRecipeVersion) {
                    manifestService.incrementRecipeVersion(manifest);
                } else if (manifest.modules?.recipes) {
                    manifest.modules.recipes.version = (manifest.modules.recipes.version || 0) + 1;
                    manifest.contentVersion = (manifest.contentVersion || 0) + 1;
                }

                await manifestService.save(manifest);
            }

            // 3. Taslakları ve Cache'i Temizle
            state.clearAllDrafts();
            githubService.clearCache();
            if (typeof professionService !== "undefined" && professionService.clearCache) {
                professionService.clearCache();
            }

            this.notifyUI();

            alert("Publish başarıyla tamamlandı!");

            // Sayfayı yenileyerek temiz state ile devam et
            location.reload();

        } catch (e) {
            console.error("Publish Hatası:", e);
            alert(
                "Publish sırasında hata oluştu:\n\n" +
                (e.message || e)
            );
        } finally {
            this.isPublishing = false;
            if (typeof navbar !== "undefined" && navbar.setLoading) {
                navbar.setLoading(false);
            }
        }
    }
}

const publishService = new PublishService();
