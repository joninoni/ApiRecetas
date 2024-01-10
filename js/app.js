function iniciarApp(){

    const selectCategorias =document.querySelector("#categorias");
    selectCategorias.addEventListener("change",mostrarReceta);
    const resultado=document.querySelector("#resultado");

    obtenerCategorias();

    function obtenerCategorias(){
        const url=`https://www.themealdb.com/api/json/v1/1/categories.php`;
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarCategorias(resultado.categories));
    }

    function mostrarCategorias(categorias =[]){
        categorias.forEach( categoria => {
            const option = document.createElement("option");
            option.value = categoria.strCategory;
            option.textContent= categoria.strCategory;
            selectCategorias.appendChild(option);
        })
    }

    function mostrarReceta(e){
        const receta = e.target.value;
        const url =`https://www.themealdb.com/api/json/v1/1/filter.php?c=${receta}`;
        
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarPlatillos(resultado.meals))
    }

    function mostrarPlatillos(platillos =[]){
        limpiarHtml(resultado);
        const heading=document.createElement("h2");
        heading.classList.add("text-center","my-5","text-black");
        heading.textContent=platillos.length ?`${platillos.length} Resultados`:"No se encontraron resultados";
        resultado.appendChild(heading);
        platillos.forEach( platillo =>{
            const {idMeal,strMeal,strMealThumb} = platillo;

            const recetaContenedor=document.createElement("div");
            recetaContenedor.classList.add("col-md-4");

            const recetaCard=document.createElement("div");
            recetaCard.classList.add("card","mb-4");

            const recetaImagen=document.createElement("img");
            recetaImagen.classList.add("card-img-top");
            recetaImagen.alt=`Imagen receta de la ${strMeal}`;
            recetaImagen.src=strMealThumb;

            const recetaCardBody=document.createElement("div");
            recetaCardBody.classList.add("card-body");

            const recetaHeading=document.createElement("h3");
            recetaHeading.classList.add("card-title","mb-3");
            recetaHeading.textContent=strMeal;

            const recetaButton=document.createElement("button");
            recetaButton.classList.add("btn","btn-danger","w-100");
            recetaButton.textContent="Ver Receta";
            recetaButton.dataset.bsTarget="#modal";
            recetaButton.dataset.bsToggle="modal"
            recetaButton.onclick=function(){
                obtenerPlatillo(idMeal);

            }

            //insertar el html
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            resultado.appendChild(recetaContenedor);
        })
    }

    function obtenerPlatillo(id){
        const receta=id;
        const url=`https://themealdb.com/api/json/v1/1/lookup.php?i=${receta}`;
        console.log(url);
    }

    function limpiarHtml(selector){
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }

}
document.addEventListener("DOMContentLoaded",iniciarApp);