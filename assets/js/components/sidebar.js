class Sidebar {

    constructor(containerId) {

        this.container = document.getElementById(containerId);

    }

    render(professions) {

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

        this.container.innerHTML = "";

        Object.keys(professions).forEach(key => {

            const item = document.createElement("button");

            item.className = "list-group-item list-group-item-action";

            item.dataset.profession = key;

            item.innerHTML = `${icons[key] ?? "📦"} ${this.formatName(key)}`;

            this.container.appendChild(item);

        });

    }

    formatName(name) {

        return name
            .split("_")
            .map(x => x.charAt(0).toUpperCase() + x.slice(1))
            .join(" ");

    }

}

const sidebar = new Sidebar("professionMenu");