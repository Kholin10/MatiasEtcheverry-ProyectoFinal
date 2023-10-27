let productos = [];
let carrito = [];


const selecProductos = document.querySelector('#productos');
const btnAgregar = document.querySelector('#agregar');
const btnVaciar = document.querySelector('#vaciar');
const btnFiltrar = document.querySelector('#filtrar');



traerItemStorage = () => {
     carrito = JSON.parse(localStorage.getItem('carrito')) || [];

};

obtenerProductos = async () =>{
    const response = await fetch ('/productos.json')
    if (response.ok){
        productos = await response.json();
        rellenarDropdown();
    }
}

rellenarDropdown = () => {
    productos.forEach(({nombre,material,precio }, index) => {
        const option = document.createElement('option')
        option.textContent = `${nombre} - ${material} - $${precio}`;
        option.value = index;
        selecProductos.appendChild(option)
    })
}


removerElementoDelCarrito = (index) => {
    if (index >= 0 && index < carrito.length) {
        carrito.splice(index, 1); 
        localStorage.setItem('carrito', JSON.stringify(carrito)); 
        dibujarTabla(); 
    }
}

calcularDescuento = () => {
    const productosDistintos = new Set(carrito.map((item) => item.producto.nombre));
    if (productosDistintos.size > 2) {
        return 0.1;
    }
    return 0;
};

document.addEventListener('DOMContentLoaded', () => {
    obtenerProductos();
    dibujarTabla();

    btnAgregar.addEventListener('submit', (e) => {
        e.preventDefault();

        Toastify({
            text: "Producto agregado",
            duration: 3000,
            destination: "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley",
            newWindow: true,
            close: true,
            style: {
              background: "linear-gradient(to right, #00b09b, #96c93d)",
            },
            onClick: function(){} 
          }).showToast();
        
        
        const productoSeleccionado = productos.find((item, index) => index === +selecProductos.value)


        const indiceDelProducto = carrito.findIndex((ItemCompra) => ItemCompra.producto.nombre === productoSeleccionado.nombre );

        if (indiceDelProducto !== -1) {
            carrito[indiceDelProducto].cantidad++
            carrito[indiceDelProducto].producto.subtotal+=carrito[indiceDelProducto].producto.precio
        } else{

            const item = new ItemCompra(productoSeleccionado,1);
            carrito.push(item);
        }

        

        localStorage.setItem('carrito', JSON.stringify(carrito))
        dibujarTabla();

    })

    btnVaciar.addEventListener('click', () =>{
        Swal.fire({
            title: 'Estas seguro de vaciar el carrito?',
            text: "Esto es irreversible",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si!'
          }).then((result) => {
            if (result.isConfirmed) {
                carrito = [];
                localStorage.setItem('carrito', carrito)
                dibujarTabla();
                
                Swal.fire({
                    title: 'Vaciado!',
                    text: 'Tu carrio fue vaciado',
                    icon: 'success',
                })
              
            }
          })
       

    })

    btnFiltrar.addEventListener('click', () => {
        carrito.sort((a, b) => a.producto.subtotal - b.producto.subtotal);
        dibujarTabla();
    });

})


dibujarTabla = () => {
    const bodyTabla = document.getElementById('items');
    const total = document.querySelector('#total');
    bodyTabla.innerHTML = '';

    carrito.forEach((item, index) => {
        const { producto: { nombre, material, precio }, cantidad } = item;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${nombre || ''}</td>
            <td>${material || ''}</td>
            <td>$${precio || ''}</td>
            <td>${cantidad || ''}</td>
            <td>${cantidad * precio || 0}</td>
            <td>
                <button id="incrementar-${index}" class="btn btn-success">+</button>
            </td>
            <td>
                <button id="decrementar-${index}" class="btn btn-danger">-</button>
            </td>
            <td>
                <button id="item-${index}" class="btn btn-danger">Remover</button>
            </td>
        `;

        bodyTabla.appendChild(row);

        const removeButton = row.querySelector(`#item-${index}`);
                removeButton.addEventListener('click', () => {
                removerElementoDelCarrito(index); 
        });

        const incrementar = row.querySelector(`#incrementar-${index}`);
                incrementar.addEventListener('click', () => {
            
                carrito[index].cantidad++;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                dibujarTabla(); 
        });

        const disminuir = row.querySelector(`#decrementar-${index}`);
            disminuir.addEventListener('click', () => {
            
                if (carrito[index].cantidad > 1) {
                    carrito[index].cantidad--;
                } else {
                
                 carrito.splice(index, 1);
                }
                localStorage.setItem('carrito', JSON.stringify(carrito));
                dibujarTabla(); 
        });

    });
    

    const descuento = calcularDescuento();
    const subtotal = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    const descuentoAplicado = subtotal * descuento;

    const totalElement = document.querySelector('#total');
    const descuentoElement = document.querySelector('#descuento');

    totalElement.textContent = (subtotal - descuentoAplicado);
    descuentoElement.textContent = `-$${descuentoAplicado}`;
    
};


