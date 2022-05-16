//Referimos al DOM y declaramos variables//
const cards = document.getElementById ("cards")
const items = document.getElementById ("items")
const footer = document.getElementById ("footer")
const templateCard = document.getElementById ("template-card").content
const templateFooter = document.getElementById ("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment ()
let carrito = {}



//Consultamos y llamamos de forma async a nuestra Api//
document.addEventListener ('DOMContentLoaded' , () => {
    fetchData ()
    //LocalStorage-JSON
    if(localStorage.getItem("carrito")){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        printCarrito()
    }
} )
//Eventos//
cards.addEventListener("click", e =>{
    addCarrito(e)

})
items.addEventListener("click" , e => {
    btnAction(e)
} )

//Consultamos y llamamos de forma async a nuestra Api (Ruta local)//
const fetchData = async () => {
    try {
        const res = await fetch ("./api.json")
        const data = await res.json()
       // console.log(data)
        printCards (data)

    } catch (error) {
        console.log (error)
    }

}

//print de las cards de forma dinámica.Intecatuado con el DOM//
const printCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.Precio
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector(".btn-dark").dataset.id = producto.id


        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)

    })
    cards.appendChild(fragment)

}
const addCarrito = e =>{
   // console.log (e.target)
   // console.log (e.target.classList.contains("btn-dark"))
    if(e.target.classList.contains("btn-dark")) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito = objeto => {
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector(".btn-dark").dataset.id,
        title: objeto.querySelector("h5").textContent,
        Precio: objeto.querySelector("p").textContent,
        cantidad: 1
    }

    //Si este if existe y se cumple (true), significa que el producto se esta duplicando
    // y solo debemos sumar cantidad y ninguna otra propiedad,  ya que el producto se repite
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1

    }
    carrito[producto.id] = {...producto}
    printCarrito ()
}
 
//Agregamos de forma dinámica las compras de productos y cantidad que desea el usuario//
const printCarrito = () => {
    //console.log (carrito)//
    items.innerHTML = "" //Limpiamos el html, para que no se repita el producto seleccionado por el usuario//
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector("th").textContent = producto.id
        templateCarrito.querySelectorAll("td")[0].textContent = producto.title
        templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
        templateCarrito.querySelector(".btn-info").dataset.id = producto.id
        templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
        templateCarrito.querySelector("span").textContent = producto.cantidad * producto.Precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)


    //Agregamos el template del footer dinámicamente//
    printFooter()

    //Cada vez que se imprima el carrito ==> Almacenamos en el localStorage
    localStorage.setItem("carrito" , JSON.stringify(carrito))
}
 const printFooter = () => {
     footer.innerHTML = ""
     if( Object.keys(carrito).length === 0){ //En Caso que el carrito este vacio, se genera ese template-Carrito vacio!
         footer.innerHTML = `
         <th scope="row" colspan="5">Carrito vacío - Comience su compra!</th>
         `
         return
     }
     const cantidadTotal = Object.values(carrito).reduce((acumulador, {cantidad})=> acumulador + cantidad,0)

     const nPrecio = Object.values(carrito).reduce((acumulador, {cantidad , Precio})=> acumulador + cantidad * Precio ,0)

     templateFooter.querySelectorAll("td")[0].textContent = cantidadTotal 
     templateFooter.querySelector("span").textContent = nPrecio

    const clone = templateFooter.cloneNode (true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById("vaciar-carrito")
    btnVaciar.addEventListener("click" , () =>{
        carrito = []
        printCarrito ()
    })
}
 
const btnAction = e => { 
    console.log(e.target)
    //Evento/Accion del Boton de AGREGAR CANTIDAD
    if(e.target.classList.contains("btn-info")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        printCarrito ()
    }
     //Evento/Accion del Boton de DISMINUIR CANTIDAD
    if(e.target.classList.contains("btn-danger")){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0 ){
            delete carrito[e.target.dataset.id]
        }
        printCarrito()
    }
    e.stopPropagation()  
}
