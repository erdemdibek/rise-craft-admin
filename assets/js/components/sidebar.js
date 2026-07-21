class Sidebar {

    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.activeProfession = null;
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

            const button = document.createElement("button");

            button.type = "button";
            button.className = "list-group-item list-group-item-action";
            button.dataset.profession = key;

            button.innerHTML = `
                <span class="me-2">${icons[key] ?? "📦"}</span>
                ${this.formatName(key)}
            `;

            if (key === this.activeProfession) {
                button.classList.add("active");
            }

            button.addEventListener("click", () => {

                this.setActive(key);

                if (typeof loadProfession === "function") {
                    loadProfession(key);
                }

            });

            this.container.appendChild(button);

        });

    }

    setActive(profession) {

        this.activeProfession = profession;

        this.container.querySelectorAll(".list-group-item").forEach(item => {

            item.classList.remove("active");

            if (item.dataset.profession === profession) {
                item.classList.add("active");
            }

        });

    }

    clearActive() {

        this.activeProfession = null;

        this.container.querySelectorAll(".list-group-item").forEach(item => {
            item.classList.remove("active");
        });

    }

    formatName(name) {

        return name
            .split("_")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    }

}

const sidebar = new Sidebar("professionMenu");