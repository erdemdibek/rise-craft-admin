class Navbar {

    constructor() {

        this.publishButton =
            document.getElementById("publishButton");

        this.draftBadge =
            document.getElementById("draftBadge");

        this.update();

    }

    update() {

        const total =
            publishService.getFiles().length;

        this.draftBadge.innerText = total;

        this.publishButton.disabled =
            total === 0;

    }

}

const navbar =
    new Navbar();