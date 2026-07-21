document.addEventListener("DOMContentLoaded", async () => {

    try {

        const manifest = await manifestService.load();

        document.getElementById("contentVersion").textContent =
            manifest.contentVersion;

        document.getElementById("recipeVersion").textContent =
            manifest.modules.recipes.version;

        document.getElementById("materialVersion").textContent =
            manifest.modules.materials.version;

    } catch (e) {

        console.error(e);

        alert("Manifest okunamadı.");

    }

});