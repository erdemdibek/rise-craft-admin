class ProfessionService {
    constructor() {
        this.path = "modules/recipes.json";
        this.cachedProfessions = null;
    }

    /**
     * Meslekler listesini yükler.
     * Mobilde hızı artırmak için önce önbelleğe bakar.
     */
    async load(forceRefresh = false) {
        // Zaten yüklenmişse ve yenileme istenmiyorsa önbellekten dön (Hızlı Mobil Açılış)
        if (!forceRefresh && this.cachedProfessions) {
            return this.cachedProfessions;
        }

        try {
            const data = await githubService.downloadJson(this.path, forceRefresh);
            
            if (data) {
                this.cachedProfessions = data;
                return data;
            }
            
            // Eğer repoda henüz dosya yoksa boş nesne dönerek çökmesini engelle
            return {};
        } catch (error) {
            console.error("ProfessionService Yükleme Hatası:", error);
            
            // İnternet kopması vb. durumlarda varsa eski önbelleği döndür
            if (this.cachedProfessions) {
                return this.cachedProfessions;
            }
            
            throw error;
        }
    }

    /**
     * Önbelleği temizler (Yayınlama/Publish sonrası güncel veriyi almak için)
     */
    clearCache() {
        this.cachedProfessions = null;
    }
}

const professionService = new ProfessionService();
