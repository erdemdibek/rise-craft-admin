export class Recipe {

    constructor(data = {}) {

        this.id = data.id ?? "";

        this.name = data.name ?? "";

        this.levelRequired = data.levelRequired ?? 1;

        this.xpGiven = data.xpGiven ?? 0;

        this.isIntermediate = data.isIntermediate ?? false;

        this.materials = data.materials ?? {};

    }

}