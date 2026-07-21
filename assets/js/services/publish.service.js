class PublishService {

    constructor() {

        this.changedFiles = new Map();

    }

    addRecipeFile(profession, recipes) {

        this.changedFiles.set(

            `modules/recipes/${profession}.json`,

            recipes

        );

    }

    hasChanges() {

        return this.changedFiles.size > 0;

    }

    clear() {

        this.changedFiles.clear();

    }

    getFiles() {

        return [...this.changedFiles.entries()];

    }

}

const publishService = new PublishService();