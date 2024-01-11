function iniciarApp(){

    const selectCategorias =document.querySelector("#categorias");
    selectCategorias.addEventListener("change",mostrarReceta);

    const resultado=document.querySelector("#resultado");

    const modal =new bootstrap.Modal("#modal",{});

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
        fetch(url)
            .then(resultado => resultado.json())
            .then(respuesta => mostrarPlatillo(respuesta.meals[0]))
    }

    function mostrarPlatillo(receta){
        const {idMeal,strInstructions,strMeal,strMealThumb}=receta;
        const modalTitle=document.querySelector(".modal .modal-title");
        const modalBody=document.querySelector(".modal .modal-body");

        limpiarHtml(modalBody);//Limpia las recetas anteriores que se mostraron en el modal
        modalTitle.textContent=strMeal;

        const imagen=document.createElement("img");
        imagen.classList.add("img-fluid");
        imagen.src=strMealThumb;
        imagen.alt=`Receta de ${strMeal}`;

        const hedingModal=document.createElement("h3");
        hedingModal.classList.add("my-3");
        hedingModal.textContent="Instrucciones";

        const instrucciones=document.createElement("p");
        instrucciones.textContent=strInstructions;

        const ingredientesCantidades=document.createElement("h3");
        ingredientesCantidades.classList.add("my-3");
        ingredientesCantidades.textContent="Ingredientes y Cantidades";
        
        modalBody.appendChild(imagen);
        modalBody.appendChild(hedingModal);
        modalBody.appendChild(instrucciones);
        modalBody.appendChild(ingredientesCantidades);
        
        const ul=document.createElement("ul");
        ul.classList.add("list-group");
        for(let i=1;i<=20;i++){
            if(receta[`strIngredient${i}`]){
                const ingrediente=receta[`strIngredient${i}`];
                const cantidad=receta[`strMeasure${i}`];

                const li=document.createElement("li");
                li.classList.add("list-group-item");
                li.textContent=`${ingrediente} - ${cantidad}`;

                ul.appendChild(li);
                modalBody.appendChild(ul)
            }
        }
        const botones=document.querySelector(".modal-footer");
        limpiarHtml(botones)//limpia los botones previos

        //botones de guardar favorito y cerrar
        const btnFavorito=document.createElement("button");
        btnFavorito.classList.add("btn","btn-danger","col");
        btnFavorito.textContent="Guardar Favorito";

        btnFavorito.onclick=function(){

            if (existeStorage(idMeal)) {
                return
            }
                guardarFavorito({
                    //pasamos solo lo que vamos a necesitar del arreglo
                    id:idMeal,
                    title:strMeal,
                    img:strMealThumb,
                });     
        }

        const btnCerrar=document.createElement("button");
        btnCerrar.classList.add("btn","btn-secondary","col");
        btnCerrar.textContent="Cerrar";
        btnCerrar.onclick=function(){
            modal.hide();
        }

        botones.appendChild(btnFavorito);
        botones.appendChild(btnCerrar);
        
        modal.show();
    }

    function guardarFavorito(receta){
        const favoritos=JSON.parse(localStorage.getItem("favoritos")) ?? [];//operador de colision nula o indefinido
        localStorage.setItem("favoritos",JSON.stringify([...favoritos,receta]));
    }

    //funcion que verifica si una receta existe
    function existeStorage(id){
        const favoritos=JSON.parse(localStorage.getItem("favoritos")) ?? [];
        return favoritos.some(favorito => favorito.id ===id);
    }
 
    function limpiarHtml(selector){
        while (selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }

}
document.addEventListener("DOMContentLoaded",iniciarApp);