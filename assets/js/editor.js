const ids=[
"recipeName",
"recipeId",
"recipeLevel",
"recipeXp",
"intermediate"
];

function updatePreview(){

const json={

id:recipeId.value,

name:recipeName.value,

levelRequired:Number(recipeLevel.value),

xpGiven:Number(recipeXp.value),

isIntermediate:intermediate.checked,

materials:{}

};

jsonPreview.textContent=
JSON.stringify(json,null,2);

}

ids.forEach(id=>{

document
.getElementById(id)
.addEventListener("input",updatePreview);

});

saveBtn.addEventListener("click",()=>{

alert("GitHub kayıt sistemi sonraki pakette gelecek.");

});

updatePreview();