class RecipeService {
    constructor() {
        this.cache = {};
    }

    /**
     * Belirtilen mesleğe ait reçeteleri yükler.
     * Öncelikli olarak Local Draft -> Memory Cache -> GitHub sıralamasını takip eder.
     */
    async load(profession, forceRefresh = false) {
        if (!profession) {
            throw new Error("Meslek belirtilmedi.");
        }

        // 1. Öncelik: Henüz yayınlanmamış yerel taslak (Draft) var mı?
        if (typeof state !== "undefined" && state.hasDraft && state.hasDraft(profession)) {
            return state.getDraft(profession);
        }

        // 2. Öncelik: Önbellek (Yenileme istenmediyse)
        if (!forceRefresh && this.cache[profession]) {
            return this.cache[profession];
        }

        try {
            const data = await githubService.downloadJson(
                `modules/recipes/${profession}.json`,
                forceRefresh
            );

            // Gelen veri liste formatında mı kontrol et
            const recipes = Array.isArray(data) ? data : [];
            
            // Hafızaya al
            this.cache[profession] = recipes;

            return recipes;
        } catch (error) {
            console.warn(`${profession} reçeteleri yüklenirken hata veya dosya bulunamadı:`, error);
            
            // Dosya henüz repoda yoksa sıfırdan oluşturulabilmesi için boş dizi dön
            return [];
        }
    }

    /**
     * Belirli bir meslek için bellekte tutulan reçete cache'ini temizler
     */
    clearCache(profession) {
        if (profession) {
            delete this.cache[profession];
        } else {
            this.cache = {};
        }
    }
}

const recipeService = new RecipeService();
