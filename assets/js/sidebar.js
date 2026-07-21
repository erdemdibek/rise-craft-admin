document.addEventListener("DOMContentLoaded", async () => {

    const menu = document.getElementById("professionMenu");

    if (!menu) return;

    const json = await professionService.load();

    const professions = professionService.getList(json);

    const icons = {

        alchemy: "🧪",

        armor_smithing: "🛡",

        blacksmithing: "⚒",

        carpentry: "🪵",

        cooking: "🍖",

        jewel_crafting: "💍",

        leatherworking: "👜",

        stonemasonry: "🪨",

        tailoring: "🧵",

        weapon_smithing: "🗡"

    };

    menu.innerHTML = "";

    professions.forEach(key => {

        const item = document.createElement("a");

        item.href = "#";

        item.className = "list-group-item list-group-item-action";

        item.dataset.profession = key;

        item.innerHTML = `${icons[key] ?? "📦"} ${key.replaceAll("_"," ")}`;

        menu.appendChild(item);

    });

});