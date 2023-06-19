// Variables y selectores
const form = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
cargarEventos();
function cargarEventos() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto)
    form.addEventListener('submit', agregarGasto);
}

//Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }

}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad;
        document.getElementById('total').textContent = presupuesto;
        document.getElementById('restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //Crear el div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === "error") {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        // Insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, form);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {

        // Limpiar html previo
        this.limpiarHTML();

        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //Crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            //Agregar el HTML del gasto
            nuevoGasto.innerHTML = `
            ${nombre} <span class="badge badge-primary badge=pill">$${cantidad}</span>`

            //Btn borrar gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar HTML
            gastoListado.appendChild(nuevoGasto);
        });
    }

    actualizarRestante(restante) {
        document.getElementById('restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si total es 0 o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            form.querySelector('button[type="submit"]').disabled = true;
        }
    }


    limpiarHTML() {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

}

// Instanciar
const ui = new UI();
let presupuesto;

//Funciones
function preguntarPresupuesto() {
    const prespestoUsuario = prompt('¿Cúal es tú presupuesto?');

    //Verifica el valor del usuario 
    if (prespestoUsuario === "" || isNaN(prespestoUsuario) || prespestoUsuario <= 0 || prespestoUsuario === null) {
        location.reload();
    }
    //Presupuesto valido
    presupuesto = new Presupuesto(prespestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos
function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formularios
    const nombre = document.getElementById('gasto').value;
    const cantidad = Number(document.getElementById('cantidad').value);

    // validar
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    // Generar objeto gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    //Añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //Imprimir alerta
    ui.imprimirAlerta('Gasto agregado correctamente', 'success');

    // Imprimir gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reinicia el formulario
    form.reset();
}

function eliminarGasto(id) {
    //Elimina gasto desde la clase
    presupuesto.eliminarGasto(id);

    //Elimina gasto del HTML
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}