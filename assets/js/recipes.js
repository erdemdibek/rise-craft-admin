const recipes = [

{

id:"mana_potion",

name:"Mana Potion",

level:1,

xp:12

},

{

id:"health_potion",

name:"Health Potion",

level:5,

xp:24

}

];

const table=document.getElementById("recipeTable");

function loadTable(data){

table.innerHTML="";

data.forEach(recipe=>{

table.innerHTML+=`

<tr>

<td>${recipe.id}</td>

<td>${recipe.name}</td>

<td>${recipe.level}</td>

<td>${recipe.xp}</td>

<td>

<button
class="btn btn-sm btn-warning editBtn"

data-id="${recipe.id}">

<i class="bi bi-pencil"></i>

</button>

<button
class="btn btn-sm btn-danger deleteBtn"

data-id="${recipe.id}">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

});

}

loadTable(recipes);

document
.getElementById("searchInput")
.addEventListener("keyup",e=>{

const text=e.target.value.toLowerCase();

loadTable(

recipes.filter(r=>

r.name.toLowerCase().includes(text)

||

r.id.toLowerCase().includes(text)

)

);

});

document
.getElementById("newRecipeBtn")
.addEventListener("click",()=>{

location.href="editor.html";

});

document.addEventListener("click",e=>{

if(e.target.closest(".deleteBtn")){

Swal.fire({

title:"Silinsin mi?",

icon:"warning",

showCancelButton:true,

confirmButtonText:"Sil"

}).then(r=>{

if(r.isConfirmed){

Swal.fire(

"Silindi",

"Recipe kaldırıldı",

"success"

);

}

});

}

if(e.target.closest(".editBtn")){

location.href="editor.html";

}

});