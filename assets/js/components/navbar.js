class Navbar {

    constructor() {

        this.publishButton = document.getElementById("publishButton");

        this.draftBadge = document.getElementById("draftBadge");

        this.defaultButtonHtml = `
            <i class="bi bi-cloud-upload"></i>
            Publish
        `;

        if (this.publishButton) {

            this.publishButton.addEventListener("click", () => {

                publishService.publish();

            });

        }

        this.update();

    }

    update() {

        if (!this.publishButton || !this.draftBadge) {
            return;
        }

        const total = publishService.getFiles().length;

        this.draftBadge.textContent = total;

        this.publishButton.disabled = total === 0;

        this.publishButton.innerHTML = `
            <i class="bi bi-cloud-upload"></i>
            Publish (${total})
        `;

    }

    setLoading(isLoading) {

        if (!this.publishButton) {
            return;
        }

        if (isLoading) {

            this.publishButton.disabled = true;

            this.publishButton.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2"></span>
                Publishing...
            `;

        } else {

            this.publishButton.innerHTML = this.defaultButtonHtml;

            this.update();

        }

    }

}

const navbar = new Navbar();