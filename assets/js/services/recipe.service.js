import { Recipe } from "../models/recipe.model.js";

export default class RecipeService {

    async load(url) {

        const response = await fetch(url);

        const json = await response.json();

        return json.map(r => new Recipe(r));

    }

}