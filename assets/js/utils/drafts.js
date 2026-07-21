const Draft={

save(recipe){

localStorage.setItem(

"draftRecipe",

JSON.stringify(recipe)

);

},

load(){

const data=

localStorage.getItem(

"draftRecipe"

);

if(!data)
return null;

return JSON.parse(data);

},

clear(){

localStorage.removeItem(

"draftRecipe"

);

}

};