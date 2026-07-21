class Navbar {

    constructor() {

        this.publishButtons = [
            ...document.querySelectorAll("#publishButton, #publishButtonDesktop")
        ];

        this.draftBadges = [
            ...document.querySelectorAll("#draftBadge, #draftBadgeDesktop")
        ];

        this.statusText = document.getElementById("navbarStatus");

        this.bindEvents();

        this.update();

    }

    bindEvents() {

        this.publishButtons.forEach(button => {

            button.addEventListener("click", () => {

                publishService.publish();

            });

        });

    }

    update() {

        const total = publishService.getFiles().length;

        this.draftBadges.forEach(badge => {

            badge.textContent = total;

        });

        this.publishButtons.forEach(button => {

            button.disabled = total === 0;

            button.innerHTML = `

                <i class="bi bi-cloud-upload"></i>

                Publish

                <span class="badge bg-dark ms-2">

                    ${total}

                </span>

            `;

        });

        if (this.statusText) {

            this.statusText.innerHTML = total > 0

                ? `<span class="text-warning">
                        ● ${total} değişiklik bekliyor
                   </span>`

                : `<span class="text-success">
                        ● Hazır
                   </span>`;

        }

    }

    setLoading(isLoading) {

        this.publishButtons.forEach(button => {

            if (isLoading) {

                button.disabled = true;

                button.innerHTML = `

                    <span class="spinner-border spinner-border-sm me-2"></span>

                    Publishing...

                `;

            } else {

                button.disabled = false;

            }

        });

        if (this.statusText) {

            this.statusText.innerHTML = isLoading

                ? `<span class="text-warning">
                        ● Uploading...
                   </span>`

                : `<span class="text-success">
                        ● Hazır
                   </span>`;

        }

        if (!isLoading) {

            this.update();

        }

    }

}

const navbar = new Navbar();