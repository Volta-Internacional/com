// Función para agregar un equipo nuevo
function agregarEquipo() {
    // Obtener los valores del formulario
    var categoria = document.getElementById('categoria').value;
    var equipo = document.getElementById('equipo').value;
    var pico = document.getElementById('pico').value;
    var potencia = document.getElementById('potencia').value;
    var cantidad = document.getElementById('cantidad').value;
    var tiempo = document.getElementById('tiempo').value;

    // Validar que los campos requeridos no estén vacíos
    if (categoria === 'Seleccionar' || equipo === '' || pico === '' || potencia === '' || cantidad === '' || tiempo === '') {
        alert('Por favor completa todos los campos.');
        return;
    }

    // Crear un objeto con la información del equipo
    var nuevoEquipo = {
        categoria: categoria,
        equipo: equipo,
        pico: parseFloat(pico),
        potencia: parseFloat(potencia),
        cantidad: parseFloat(cantidad),
        tiempo: parseFloat(tiempo)
    };

    // Guardar el equipo en localStorage
    var equiposGuardados = localStorage.getItem('equipos') ? JSON.parse(localStorage.getItem('equipos')) : [];
    equiposGuardados.push(nuevoEquipo);
    localStorage.setItem('equipos', JSON.stringify(equiposGuardados));

    // Actualizar la tabla de equipos seleccionados y calcular el consumo total
    mostrarEquipos();
    calcularTotales();
    actualizarProduccion();
    location.reload();
}

// Función para mostrar los equipos seleccionados en la tabla
function mostrarEquipos() {
    var tablaCuerpo = document.getElementById('tablaCuerpo');
    tablaCuerpo.innerHTML = '';

    var equiposGuardados = localStorage.getItem('equipos') ? JSON.parse(localStorage.getItem('equipos')) : [];

    equiposGuardados.forEach(function(equipo, index) {
        var fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${equipo.equipo}</td>
            <td><button class="eliminar-equipo btn btn-danger btn-sm">Eliminar</button></td>
        `;
        tablaCuerpo.appendChild(fila);

        // Agregar evento al botón de eliminar
        fila.querySelector('.eliminar-equipo').addEventListener('click', function() {
            // Eliminar el equipo del localStorage
            equiposGuardados.splice(index, 1);
            localStorage.setItem('equipos', JSON.stringify(equiposGuardados));

            // Mostrar nuevamente la lista actualizada
            mostrarEquipos();
            calcularTotales();
        });
    });
}

// Función para calcular los totales de potencia y consumo
function calcularTotales() {
    var equiposGuardados = localStorage.getItem('equipos') ? JSON.parse(localStorage.getItem('equipos')) : [];
    var potenciaTotal = 0;
    var consumoTotal = 0;
    var potenciaTotalPico = 0;
    var hayPotenciaPico = false;

    equiposGuardados.forEach(function(equipo) {
        var potencia = equipo.potencia;
        var cantidad = equipo.cantidad;
        var tiempo = equipo.tiempo;
        var pico = equipo.pico;

        if (!isNaN(potencia) && !isNaN(cantidad) && !isNaN(tiempo)) {
            potenciaTotal += potencia * cantidad;
            consumoTotal += potencia * cantidad * tiempo;
            potenciaTotalPico += pico * cantidad;
        }

        // Verificación de potencia pico
        if (!isNaN(pico) && pico > 0) {
            hayPotenciaPico = true;
        }
    });

    var resultado = potenciaTotal + potenciaTotalPico;
    var inversor = 0;
    if (!hayPotenciaPico) {
        if (resultado >= 1 && resultado <= 100) {
            inversor = 260000;
        } else if (resultado > 100 && resultado <= 300) {
            inversor = 320000;
        } else if (resultado > 300 && resultado <= 500) {
            inversor = 500000;
        } else if (resultado > 500 && resultado <= 800) {
            inversor = 700000;
        } else if (resultado > 800 && resultado <= 1200) {
            inversor = 900000;
        }
    } else {
        if (resultado >= 50 && resultado <= 400) {
            inversor = 600000;
        } else if (resultado > 400 && resultado <= 800) {
            inversor = 900000;
        } else if (resultado > 800 && resultado <= 1200) {
            inversor = 1100000;
        } else if (resultado > 1200 && resultado <= 1800) {
            inversor = 1300000;
        } else if (resultado > 1800 && resultado <= 2200) {
            inversor = 1600000;
        } else if (resultado > 2200 && resultado <= 2800) {
            inversor = 1900000;
        } else if (resultado > 2800 && resultado <= 3200) {
            inversor = 2500000;
        } else if (resultado > 3200 && resultado <= 3800) {
            inversor = 3000000;
        } else if (resultado > 3800 && resultado <= 5800) {
            inversor = 4500000;
        }
    }

    var inversorElemento = document.getElementById('inversor');
    if (inversorElemento) {
        inversorElemento.textContent = inversor.toLocaleString(); // Formateamos el número con separadores de miles
    }
 document.getElementById('potenciaTotal').textContent = potenciaTotal.toFixed(0);
    console.log('potenciaTotal:', potenciaTotal);
    console.log('consumoTotal:', consumoTotal);
    console.log('potenciaTotalPico:', potenciaTotalPico);
    console.log('hayPotenciaPico:', hayPotenciaPico);

    document.getElementById('potenciaTotal').textContent = resultado.toFixed(0);
    document.getElementById('consumoTotal').textContent = consumoTotal.toFixed(0);
    document.getElementById('potenciaTotalPico').textContent = potenciaTotalPico.toFixed(0);

    // Mostrar si hay potencia pico o no
    document.getElementById('hayPotenciaPico').textContent = hayPotenciaPico ? "Hay potencia pico" : "No hay potencia pico";
}

// Evento al cargar la página para mostrar los equipos guardados y calcular totales
document.addEventListener('DOMContentLoaded', function() {
    mostrarEquipos();
    calcularTotales();
});



function eliminarEquipo(boton, event) {
    // Evitar la acción por defecto del botón (que podría ser un envío de formulario)
    event.preventDefault();

    // Obtener la fila a la que pertenece el botón
    var fila = boton.closest('tr');
    
    // Obtener la potencia total del equipo a eliminar desde la primera celda de la fila
    var potenciaTotalEliminarStr = fila.querySelector('td:nth-child(1)').textContent.trim();
    
    // Extraer y convertir la potencia total a número
    var potenciaTotalEliminar = parseFloat(potenciaTotalEliminarStr.split(':')[1].trim());

    // Validar si se pudo convertir a número correctamente
    if (isNaN(potenciaTotalEliminar)) {
        alert('Error al obtener la potencia total del equipo.');
        return;
    }

    // Eliminar la fila específica del DOM
    fila.remove();

    // Actualizar el Consumo Total sin recargar la página
    var consumoTotalElemento = document.getElementById('consumoTotal');
    var consumoTotalActual = parseFloat(consumoTotalElemento.textContent.trim());
    
    // Validar si se pudo convertir a número correctamente
    if (isNaN(consumoTotalActual)) {
        consumoTotalActual = 0;
    }

    var nuevoConsumoTotal = consumoTotalActual - potenciaTotalEliminar;

    // Actualizar el texto del Consumo Total
    consumoTotalElemento.textContent = nuevoConsumoTotal;
}



// Función para recalcular los totales después de agregar o eliminar filas
function recalcularTotales() {
    var potenciaTotal = 0;
    var consumoTotal = 0;

    // Iterar sobre las filas de la tabla
    var table = document.getElementById("tablaCuerpo");
    for (var i = 0; i < table.rows.length; i++) {
        var equipoInfo = table.rows[i].cells[0].textContent;
        var potencia = parseFloat(equipoInfo.match(/Potencia: (\d+)W/)[1]);
        var tiempo = parseFloat(equipoInfo.match(/Tiempo: (\d+)h/)[1]);
        var cantidad = parseFloat(equipoInfo.match(/Cantidad: (\d+)/)[1]);

        potenciaTotal += potencia * cantidad;
        consumoTotal += potencia * tiempo * cantidad;
    }

    // Actualizar los valores totales en el DOM
    document.getElementById("potenciaTotal").textContent = potenciaTotal;
    document.getElementById("consumoTotal").textContent = consumoTotal;
}
// Función para cambiar las opciones del select de equipos según la categoría seleccionada



function cambiarOpciones() {
    var categoriaSeleccionada = document.getElementById("categoria").value;
    var opcionesSelect = document.getElementById("equipo");

    // Limpiamos el select de opciones
    opcionesSelect.innerHTML = '';

    // Definimos las opciones según la categoría seleccionada
    var opciones = [];
    switch (categoriaSeleccionada) {
        case "Neveras y Congeladores":
            opciones = ["Seleccionar","nevera mini bar (40L a 100L)", "nevera mini bar inverter (40L a 1001)", "nevera pequeña (100L a 2001)", "nevera pequeña inverter (100L a 2001)", "nevera mediana (200L a 3001)", "nevera mediana inverter (200L a 3001)", "nevera grande (300L +)", "nevera grande inverter (3001 +)", "congelador pequeño (50L a 150L)", "congelador pequeño inverter (SOL a 150L)", "congelador mediano (150L a 2501)", "congelador mediano inverter (150L a 250)", "congelador grande (250L +)", "congelador grande inverter (250L +)", "nevera comercial pequeña (200L a 500L)", "nevera comercial grande (500L +)"];
            break;
        case "Telefonia e Internet":
            opciones = ["Seleccionar","celular", "router wifi", "antena wifi satelital"];
            break;
        case "Tv y Entretenimiento":
            opciones = ["Seleccionar","tv hasta 32\"", "tv 40\" a 50\"", "tv más de 50\"", "bafle grande", "bafle pequeño", "videobeam", "decodificador tv"];
            break;
        case "Iluminacion":
            opciones = ["Seleccionar","Bombillo LED 5W", "Bombillo LED 7W", "Bombillo LED 9W", "Bombillo LED 12W", "reflector 50W", "reflector 100W"];
            break;
        case "Cocina y Hogar":
            opciones = ["Seleccionar","estufa electrica 2", "cafetera", "licuadora", "lavadora semiautomatica", "lavadora automatica", "ventilador de pedestal", "ventilador de mesa", "ducha electrica", "aire acondicionado 12000 BTU", "aire acondicionado 12000 BTU Inverter"];
            break;
        case "Herramientas":
            opciones = ["Seleccionar","Taladro manual", "Pulidora manual"];
            break;
        case "Computacion":
            opciones = ["Seleccionar","Computador portatil", "Computador de mesa"];
            break;
        case "Electrobombas":
            opciones = ["Seleccionar","1/2 hp", "1 hp", "2 hp"];
            break;
        case "Otros":
            opciones = ["Seleccionar","Otro"];
            break;
        default:
            opciones = ["Seleccionar"];
    }

    // Agregamos las nuevas opciones al select
    opciones.forEach(function(opcion) {
        var opcionElemento = document.createElement("option");
        opcionElemento.text = opcion;
        opcionesSelect.add(opcionElemento);
    });
}

// Función para actualizar la potencia y el tiempo según el equipo seleccionado
function actualizarPotencia() {
    var equipoSeleccionado = document.getElementById("equipo").value;
    var potenciaInput = document.getElementById("potencia");
    var tiempoInput = document.getElementById("tiempo");

    // Definimos la potencia y el tiempo según el equipo seleccionado
    var datosEquipo = {
        "licuadora": { "potenciaInput": "400", "tiempoInput": "1" },
        "lavadora semiautomatica": { "potenciaInput": "400", "tiempoInput": "2" },
        "nevera mini bar (40L a 100L)": { "potenciaInput": "25" },
        "nevera mini bar inverter (40L a 1001)": { "potenciaInput": "21" },
        "congelador pequeño inverter (SOL a 150L)": { "potenciaInput": "21" },
        "nevera pequeña (100L a 2001)": { "potenciaInput": "33" },
        "nevera pequeña inverter (100L a 2001)": { "potenciaInput": "28" },
        "nevera mediana (200L a 3001)": { "potenciaInput": "44" },
        "congelador mediano (150L a 2501)": { "potenciaInput": "44" },
        "nevera mediana inverter (200L a 3001)": { "potenciaInput": "38" },
        "nevera grande (300L +)": { "potenciaInput": "54" },
        "nevera grande inverter (300L +)": { "potenciaInput": "48" },
        "congelador pequeño (50L a 150L)": { "potenciaInput": "24" },
        "congelador grande (250L +)": { "potenciaInput": "105" },
        "congelador grande inverter (250L +)": { "potenciaInput": "86" },
        "nevera comercial pequeña (200L a 500L)": { "potenciaInput": "125" },
        "nevera comercial grande (500L +)": { "potenciaInput": "290" },
        "tv hasta 32\"": { "potenciaInput": "60" },
        "bafle grande": { "potenciaInput": "60" },
        "Computador portatil": { "potenciaInput": "60" },
        "antena wifi satelital": { "potenciaInput": "60" },
        "tv 40\" a 50\"": { "potenciaInput": "80" },
        "tv más de 50\"": { "potenciaInput": "100" },
        "reflector 100W": { "potenciaInput": "100" },
        "router wifi": { "potenciaInput": "20" },
        "bafle pequeño": { "potenciaInput": "20" },
        "videobeam": { "potenciaInput": "180" },
        "decodificador tv": { "potenciaInput": "35" },
        "celular": { "potenciaInput": "8" },
        "Bombillo LED 5W": { "potenciaInput": "5" },
        "Bombillo LED 7W": { "potenciaInput": "7" },
        "Bombillo LED 9W": { "potenciaInput": "9" },
        "Bombillo LED 12W": { "potenciaInput": "12" },
        "reflector 50W": { "potenciaInput": "50" },
        "ventilador de pedestal": { "potenciaInput": "50", "tiempoInput": "6" },
        "estufa electrica 2": { "potenciaInput": "800" },
        "lavadora automatica": { "potenciaInput": "800", "tiempoInput": "2" },
        "cafetera": { "potenciaInput": "720", "tiempoInput": "1" },
        "ventilador de mesa": { "potenciaInput": "30", "tiempoInput": "6" },
        "ducha electrica": { "potenciaInput": "1800", "tiempoInput": "1" },
        "aire acondicionado 12000 BTU": { "potenciaInput": "880", "tiempoInput": "8" },
        "aire acondicionado 12000 BTU Inverter": { "potenciaInput": "693", "tiempoInput": "8" },
        "Taladro manual": { "potenciaInput": "900" },
        "Pulidora manual": { "potenciaInput": "1200" },
        "Computador de mesa": { "potenciaInput": "150" },
        "1/2 hp": { "potenciaInput": "375" },
        "1 hp": { "potenciaInput": "750" },
        "2 hp": { "potenciaInput": "1500" }
    };

    // Actualizamos los valores de potencia y tiempo según el equipo seleccionado
    if (datosEquipo[equipoSeleccionado]) {
        potenciaInput.value = datosEquipo[equipoSeleccionado].potenciaInput || "";
        tiempoInput.value = datosEquipo[equipoSeleccionado].tiempoInput || "";
    } else {
        potenciaInput.value = "";
        tiempoInput.value = "";
    }
}

// Función para actualizar el tiempo de uso según la categoría y el equipo seleccionado
function actualizartiempo() {
    var categoriaSelect = document.getElementById("categoria");
    var equipoSelect = document.getElementById("equipo");
    var tiempoInput = document.getElementById("tiempo");
    // Obtenemos los valores seleccionados
var categoriaSeleccionada = categoriaSelect.value;
var equipoSeleccionado = equipoSelect.value;

// Definimos los tiempos según la categoría y el equipo seleccionado
switch (categoriaSeleccionada) {
    case "Cocina y Hogar":
        switch (equipoSeleccionado) {
            case "estufa electrica 2":
            case "lavadora semiautomatica":
            case "lavadora automatica":
                tiempoInput.value = "2";
                break;
            case "licuadora":
            case "cafetera":
            case "ducha electrica":
                tiempoInput.value = "1";
                break;
            case "ventilador de mesa":
            case "ventilador de pedestal":
                tiempoInput.value = "6";
                break;
            case "aire acondicionado 12000 BTU":
            case "aire acondicionado 12000 BTU Inverter":
                tiempoInput.value = "8";
                break;
            default:
                tiempoInput.value = "";
        }
        break;
    case "Telefonia e Internet":
        switch (equipoSeleccionado) {
            case "celular":
                tiempoInput.value = "2";
                break;
            case "router wifi":
            case "antena wifi satelital":
                tiempoInput.value = "24";
                break;
            default:
                tiempoInput.value = "";
        }
        break;
    case "Neveras y Congeladores":
        tiempoInput.value = "24";
        break;
    case "Tv y Entretenimiento":
        tiempoInput.value = "4";
        break;
    case "Iluminacion":
        tiempoInput.value = "6";
        break;
    case "Herramientas":
        tiempoInput.value = "1";
        break;
    case "Computacion":
        tiempoInput.value = "4";
        break;
    case "Electrobombas":
        tiempoInput.value = "2";
        break;
    default:
        tiempoInput.value = "";
}
}

// Función para habilitar o deshabilitar el campo de cantidad según la categoría y equipo seleccionado
// Función para habilitar o deshabilitar el campo de cantidad según la categoría y equipo seleccionado
function habilitarInput() {
    var categoriaSelect = document.getElementById("categoria");
    var equipoSelect = document.getElementById("equipo");
    var picoInput = document.getElementById("pico");

    // Habilitamos el campo de cantidad según la categoría y equipo seleccionado
    if (categoriaSelect.value === "Neveras y Congeladores" ||
        categoriaSelect.value === "Herramientas" ||
        categoriaSelect.value === "Electrobombas" ||
        (equipoSelect.value === "ventilador de mesa" ||
        equipoSelect.value === "ventilador de pedestal" ||
        equipoSelect.value === "lavadora semiautomatica" ||
        equipoSelect.value === "lavadora automatica")) {
        picoInput.disabled = false;
    } else {
        picoInput.disabled = true;
        picoInput.value = "0"; // Valor por defecto cuando está deshabilitado
    }

    // Calculamos el valor de la cantidad según la potencia si está habilitado
    if (!picoInput.disabled) {
        var potenciaInput = document.getElementById("potencia");
        picoInput.value = parseFloat(potenciaInput.value) * 30;
        
        // Consideramos el caso específico de equipos que requieren multiplicar la potencia por 2
        if (equipoSelect.value === "ventilador de mesa" ||
            equipoSelect.value === "ventilador de pedestal" ||
            equipoSelect.value === "lavadora semiautomatica" ||
            equipoSelect.value === "lavadora automatica") {
            picoInput.value = parseFloat(potenciaInput.value) * 2;
        }
    }
}

// Event listeners para los cambios en los selects
document.getElementById("categoria").addEventListener("change", function() {
    cambiarOpciones();
    actualizartiempo();
    habilitarInput();
});

document.getElementById("equipo").addEventListener("change", function() {
    actualizarPotencia();
    actualizartiempo();
    habilitarInput();
});


// Función para agregar una categoría al formulario
function agregarCategoria() {
// Aquí puedes implementar la lógica para agregar una categoría al formulario, si es necesario
// Esta función puede ser extendida según los requerimientos específicos del formulario
console.log("Agregar categoría...");
}

// Event listener para ejecutar cambiarOpciones() al cargar la página
document.addEventListener("DOMContentLoaded", function() {
cambiarOpciones();
});

// Event listeners para los cambios en los selects
document.getElementById("categoria").addEventListener("change", function() {
cambiarOpciones();
actualizartiempo();
});

document.getElementById("equipo").addEventListener("change", function() {
actualizarPotencia();
actualizartiempo();
habilitarInput();
});