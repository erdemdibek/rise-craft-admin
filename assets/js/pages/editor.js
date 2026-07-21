const container=
document.getElementById("materialContainer");

document
.getElementById("addMaterial")
.onclick=()=>{

container.appendChild(

createMaterialRow()

);

updatePreview();

};

document.addEventListener("click",e=>{

if(e.target.closest(".removeMaterial")){

e.target.closest(".material-row").remove();

updatePreview();

}

});

document.addEventListener("input",updatePreview);

function updatePreview(){

const materials={};

document.querySelectorAll(".material-row")
.forEach(r=>{

const name=
r.querySelector(".material-name").value;

const amount=
parseInt(

r.querySelector(".material-count").value

)||1;

if(name!="")

materials[name]=amount;

});

const recipe={

id:recipeId.value,

name:recipeName.value,

levelRequired:Number(recipeLevel.value),

xpGiven:Number(recipeXp.value),

isIntermediate:recipeIntermediate.checked,

materials:materials

};

jsonPreview.textContent=

JSON.stringify(recipe,null,2);

}

saveDraft.onclick=()=>{

const recipe=

JSON.parse(

jsonPreview.textContent

);

const error=

validateRecipe(recipe);

if(error){

alert(error);

return;

}

Draft.save(recipe);

alert("Taslak kaydedildi.");

};

updatePreview();