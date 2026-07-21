function validateRecipe(recipe){

if(recipe.id.trim()==="")
return "Recipe ID boş.";

if(recipe.name.trim()==="")
return "Recipe adı boş.";

if(recipe.levelRequired<1)
return "Level hatalı.";

if(recipe.xpGiven<=0)
return "XP hatalı.";

return null;

}