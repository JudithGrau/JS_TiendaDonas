/*---------------------------------------- Type writer effect ---------------------------------- */
class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
        this.txtElement = txtElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.wait = parseInt(wait, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // index actual de palabra
        const current = this.wordIndex % this.words.length;
        // obtener el texto completo de la palabra actual
        const fullTxt = this.words[current];

        // comprueba si está eliminado
        if(this.isDeleting) {
        // elimina el caracter
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        // agrega el caracter
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // Inserta txt en el elemento
        this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // Type Speed Inicial
        let typeSpeed = 300;
    
        if(this.isDeleting) {
            typeSpeed /= 2;
        }

        // Si la palabra está completa
        if(!this.isDeleting && this.txt === fullTxt) {
            // hace una pausa al final
            typeSpeed = this.wait;
            // pone eliminar para true
            this.isDeleting = true;
        } else if(this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // pasa a la siguiente palabra
            this.wordIndex++;
            // Pausa antes de empezar
            typeSpeed = 500;
        }
    
        setTimeout(() => this.type(), typeSpeed);
        }
    }

  // Init On DOM Load
    document.addEventListener('DOMContentLoaded', init);

  // Init App
    function init() {
        const txtElement = document.querySelector('.txt-type');
        const words = JSON.parse(txtElement.getAttribute('data-words'));
        const wait = txtElement.getAttribute('data-wait');
        // Init TypeWriter
        new TypeWriter(txtElement, words, wait);
    }

/* -----------------------------------------------------scroll-nav---------------------------------------- */
window.onload = () => {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content');

    window.addEventListener('scroll', (e) =>{
        let sectionID = '';
        sections.forEach(section =>{
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if(pageXOffset >= (sectionTop -sectionHeight / 4)){
                sectionID = section.getAttribute('id');
            }
        });
    });
    
    navItems.forEach(item =>{
        item.addEventListener('click', () => {
            const sectionId = item.classList[1];
            document.querySelector(`#${sectionId}`).scrollIntoView({ block:'start', behavior:'smooth'});
        })
    })
}




/*------------------------------------------------------------------------------------------------*/
$("#lista-productos").prepend($("<p><h2>Pedidos en línea</h2></p>"));
$('#lista-productos').on('click',eventoClick);


/*--------------------------------------Callback de Fade en el logo ------------------------------*/
$("h1").fadeOut("slow",function(){
    $("h1").fadeIn(2000);
    $("h1").fadeOut(2000);
    $("h1").fadeIn(2000);
});

/*-------------------------------------Sweet alert --------------------------------------------- */ 

function eventoClick(){
    Swal.fire({
        position: 'top-end',
        type: 'success',
        title: 'Se ha agregado al carrito',
        timer: 1500,
        showConfirmButton:false
    })
}

/*--------------------------------------------Carrito------------------------------------------*/
class Carrito {

    //Añadir producto al carrito
    comprarProducto(e){
        e.preventDefault();
        //Delegado para agregar al carrito
        if(e.target.classList.contains('agregar-carrito')){
            const producto = e.target.parentElement.parentElement;
            //Enviamos el producto seleccionado para tomar sus datos
            this.leerDatosProducto(producto);
        }
    }

    //Leer datos del producto
    leerDatosProducto(producto){
        const infoProducto = {
            imagen : producto.querySelector('img').src,
            titulo: producto.querySelector('h4').textContent,
            precio: producto.querySelector('.precio span').textContent,
            id: producto.querySelector('a').getAttribute('data-id'),
            cantidad: 1
        }
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (productoLS){
            if(productoLS.id === infoProducto.id){
                productosLS = productoLS.id;
            }
        });
        if(productosLS === infoProducto.id){
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'El producto ya está agregado',
                showConfirmButton: false,
                timer: 1000
            })
        }
        else {
            this.insertarCarrito(infoProducto);
        }
    }

    //muestra producto seleccionado en carrito
    insertarCarrito(producto){
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" width=100>
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);
    }

    //Eliminar el producto del carrito en el DOM
    eliminarProducto(e){
        e.preventDefault();
        let producto, productoID;
        if(e.target.classList.contains('borrar-producto')){
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();
    }

    //Elimina todos los productos
    vaciarCarrito(e){
        e.preventDefault();
        while(listaProductos.firstChild){
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();
        return false;
    }

    //Almacenar en el LS
    guardarProductosLocalStorage(producto){
        let productos;
        //Toma valor de un arreglo con datos del LS
        productos = this.obtenerProductosLocalStorage();
        //Agregar el producto al carrito
        productos.push(producto);
        //Agregamos al LS
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    //Comprobar que hay elementos en el LS
    obtenerProductosLocalStorage(){
        let productoLS;
        //Comprobar si hay algo en LS
        if(localStorage.getItem('productos') === null){
            productoLS = [];
        }
        else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    //Mostrar los productos guardados en el LS
    leerLocalStorage(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            //Construir plantilla
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" data-id="${producto.id}"></a>
                </td>
            `;
            listaProductos.appendChild(row);
        });
    }

    //Mostrar los productos guardados en el LS en compra.html
    leerLocalStorageCompra(){
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function (producto){
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}>
                </td>
                <td id='subtotales'>${producto.precio * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fas fa-times-circle" style="font-size:30px" data-id="${producto.id}"></a>
                </td>
            `;
            listaCompra.appendChild(row);
        });
    }

    //Eliminar producto por ID del LS
    eliminarProductoLocalStorage(productoID){
        let productosLS;
        //Obtenemos el arreglo de productos
        productosLS = this.obtenerProductosLocalStorage();
        //Comparar el id del producto borrado con LS
        productosLS.forEach(function(productoLS, index){
            if(productoLS.id === productoID){
                productosLS.splice(index, 1);
            }
        });
        //Añadimos el arreglo actual al LS
        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    //Eliminar todos los datos del LS
    vaciarLocalStorage(){
        localStorage.clear();
    }

    /*--------------------------------------------Procesar pedido -------------------------------*/
    procesarPedido(e){
        e.preventDefault();
        if(this.obtenerProductosLocalStorage().length === 0){
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'El carrito está vacío, agrega algún producto',
                showConfirmButton: false,
                timer: 2000
            })
        }
        else {
            location.href = "compra.html";
        }
    }

    //Calcular montos
    calcularTotal(){
        let productosLS;
        let total = 0, iva = 0, subtotal = 0;
        productosLS = this.obtenerProductosLocalStorage();
        for(let i = 0; i < productosLS.length; i++){
            let element = Number(productosLS[i].precio * productosLS[i].cantidad);
            total = total + element;
            console.log(total);
        }
        iva = parseFloat(total * 0.21).toFixed(2);
        subtotal = parseFloat(total-iva).toFixed(2);

        document.getElementById('subtotal').innerHTML = "$ " + subtotal;
        document.getElementById('iva').innerHTML = "$ " + iva;
        document.getElementById('total').value = "$ " + total.toFixed(2);
    }

    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function (productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;                    
                    actualizarMontos[index].innerHTML = Number(cantidad * productosLS[index].precio);
                }    
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));
        }
        else {
            console.log("click afuera");
        }
    }
}