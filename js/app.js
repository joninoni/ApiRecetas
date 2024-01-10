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
        limpiarHtml();
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

            //insertar el html
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            resultado.appendChild(recetaContenedor);
        })
    }

    function limpiarHtml(){
        while (resultado.firstChild) {
            resultado.removeChild(resultado.firstChild);
        }
    }

}
document.addEventListener("DOMContentLoaded",iniciarApp);