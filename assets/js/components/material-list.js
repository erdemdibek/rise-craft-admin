function createMaterialRow(name="",amount=1){

const row=document.createElement("div");

row.className="row mb-2 material-row";

row.innerHTML=`

<div class="col-8">

<input class="form-control material-name"

value="${name}"

placeholder="Material">

</div>

<div class="col-3">

<input class="form-control material-count"

type="number"

value="${amount}"

min="1">

</div>

<div class="col-1">

<button class="btn btn-danger removeMaterial">

<i class="bi bi-x"></i>

</button>

</div>

`;

return row;

}