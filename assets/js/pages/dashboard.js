document.addEventListener(

"DOMContentLoaded",

async ()=>{

    try{

        const manifest =
            await manifestService.load();

        state.setManifest(manifest);

        document.getElementById(
            "contentVersion"
        ).innerText =
            manifest.contentVersion;

        document.getElementById(
            "recipeVersion"
        ).innerText =
            manifest.modules.recipes.version;

        document.getElementById(
            "materialVersion"
        ).innerText =
            manifest.modules.materials.version;

        const professions =
            await professionService.load();

        state.setProfessions(
            professions
        );

        sidebar.render(
            professions
        );

        let totalRecipes = 0;

        for(const profession of Object.keys(professions)){

            const recipes =
                await recipeService.load(
                    profession
                );

            totalRecipes +=
                recipes.length;

        }

        document.getElementById(
            "recipeCount"
        ).innerText =
            totalRecipes;

        document.getElementById(
            "professionCount"
        ).innerText =
            Object.keys(professions).length;

    }

    catch(e){

        console.error(e);

        alert(
            "Veriler okunamadı."
        );

    }

});