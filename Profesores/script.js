

document.querySelectorAll('table.Nota input[type="number"]').forEach(input => {
    input.addEventListener('input', () =>{
        if (input.value > 100) input.value = 100;
        if (input.value < 0) input.value = 0;
    });
});


function CalcularPromedio(fila) {
    const periodos = ['periodo1','periodo2','periodo3','periodo4']

    const celdas = fila.querySelectorAll('td')

    periodos.forEach((periodo,index) => {
        const inputs = fila.querySelectorAll(`input[data-periodo="${periodo}"]`)

        let suma = 0
        let cantidad = 0 

        inputs.forEach(input => {
            const valor = parseFloat(input.value)
            if (!isNaN(valor)) {
                suma += valor
                cantidad++;
            }
        });
        const promedio = cantidad > 0 ? (suma/cantidad) : "";

        const celdaPromedio = celdas[celdas.length - 4 + index];

        celdaPromedio.textContent = formatearPromedio(promedio);
    });
}

function calcularPromediosMateria(materia) {

    const periodos = ['periodo1','periodo2','periodo3','periodo4'];
    const promedios = [];

    periodos.forEach(periodo => {

        const notas = materia[periodo];
        const validas = notas.filter(n => !isNaN(n));

        const promedio = validas.length
            ? validas.reduce((a,b)=>a+b,0) / validas.length
            : 0;

        promedios.push(promedio);
    });

    materia.promedios.p1 = promedios[0];
    materia.promedios.p2 = promedios[1];
    materia.promedios.p3 = promedios[2];
    materia.promedios.p4 = promedios[3];

    materia.promedios.final =
        promedios.reduce((a,b)=>a+b,0) / 4;
}

function CalcularPromediosGenerales() {
    const filas = document.querySelectorAll('.Nota tbody tr[data-materia]');
    let sumaPeriodos = [0, 0, 0, 0];
    let conteoPeriodos = [0, 0, 0, 0];

    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');

        for (let i = 0; i < 4; i++) {
            const texto = celdas[celdas.length - 4 + i].textContent;
            const valor = parseFloat(texto);

            if (!isNaN(valor)) {
                sumaPeriodos[i] += valor;
                conteoPeriodos[i]++;
            }
        }
    });

    const promedios = sumaPeriodos.map((suma, i) =>
        conteoPeriodos[i] ? (suma / conteoPeriodos[i]).toFixed(2) : ""
    );

    const valoresValidos = promedios
        .map(p => parseFloat(p))
        .filter(p => !isNaN(p));

    const promedioFinal = valoresValidos.length === 4
        ? (valoresValidos.reduce((a, b) => a + b, 0) / 4)
        : "";

    return { promedios, promedioFinal };
}

function formatearPromedio(valor) {
    if (valor === "" || valor === null || valor === undefined) return "";

    const num = Number(valor);

    if (isNaN(num)) return "";

    // Si es 0 exacto
    if (num === 0) return "0";

    // Si es entero (100, 85, etc.)
    if (Number.isInteger(num)) return num.toString();

    // Si tiene decimales → 1 decimal
    return num.toFixed(1);
}

document.querySelectorAll('.Nota tbody tr[data-materia]').forEach(fila => {
    fila.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            CalcularPromedio(fila);
            CalcularPromediosGenerales();
        });
    });
});


/***********************
* Ventana de Notas
***********************/
let alumnoActivoId = null;

const abrir_notas = document.querySelector('#abrir-notas')
const ventana_notas = document.querySelector('#ventana-notas')
const cerrar_notas = document.querySelector('#cerrar-notas')

abrir_notas.addEventListener("click",()=>{
    ventana_notas.showModal();
})
cerrar_notas.addEventListener("click",()=>{
    ventana_notas.close();
})




/***********************
* FUNCIONES BASE
***********************/

function crearMateria() {
    return {
        periodo1: [0,0,0,0],
        periodo2: [0,0,0,0],
        periodo3: [0,0,0,0],
        periodo4: [0,0,0,0],
        promedios: {
            p1: 0,
            p2: 0,
            p3: 0,
            p4: 0,
            final: 0
        }
    };
}


// Crear Alumno

function crearAlumno(nombre, curso, seccion) {
    return {
        id: Date.now(),
        nombre,
        curso,
        seccion,
        materias: {
            español: crearMateria(),
            ingles: crearMateria(),
            frances: crearMateria(),
            matematicas: crearMateria(),
            sociales: crearMateria(),
            naturales: crearMateria(),
            arte: crearMateria(),
            fisica: crearMateria(),
            formacion: crearMateria(),
            salida: crearMateria(),
        },
        promedios: {
            p1: 0,
            p2: 0,
            p3: 0,
            p4: 0,
            final: 0
        }
    };
}

function crearAlumnoDesdeFormulario() {
    const nombre = document.getElementById("nombre_blt").value.trim();
    const curso = document.getElementById("curso_blt").value.trim();
    const seccion = document.getElementById("seccion_blt").value.trim();

    return crearAlumno(nombre, curso, seccion);
}

function cargarNotasDesdeTabla(alumno) {
    document
        .querySelectorAll("table.Nota tbody tr[data-materia]")
        .forEach(fila => {
            const materia = fila.dataset.materia;

            fila.querySelectorAll("input[type='number']").forEach(input => {
                const periodo = input.dataset.periodo;
                const notaIndex = Number(input.dataset.nota);
                const valor = Number(input.value) || 0;

                alumno.materias[materia][periodo][notaIndex] = valor;
            });
            
            calcularPromediosMateria(alumno.materias[materia]);
        });
}

function cargarPromediosGeneralesEnAlumno(alumno) {
    const { promedios, promedioFinal } = CalcularPromediosGenerales();

    alumno.promedios.p1 = Number(promedios[0]) || 0;
    alumno.promedios.p2 = Number(promedios[1]) || 0;
    alumno.promedios.p3 = Number(promedios[2]) || 0;
    alumno.promedios.p4 = Number(promedios[3]) || 0;
    alumno.promedios.final = Number(promedioFinal) || 0;
}

function datosPersonalesCompletos() {
    const nombre = document.getElementById("nombre_blt").value.trim();
    const curso = document.getElementById("curso_blt").value.trim();
    const seccion = document.getElementById("seccion_blt").value.trim();

    if (!nombre || !curso || !seccion) {
        alert("Debes completar todos los datos personales del alumno.");
        return false;
    }
    return true;
}

function obtenerAlumnos() {
    return JSON.parse(localStorage.getItem("alumnos")) || [];
}

function guardarAlumnoCompleto() {
    if (!datosPersonalesCompletos()) return;

    if (alumnoActivoId !== null) {
        //  Editar
        const alumno = alumnos.find(a => a.id === alumnoActivoId);
        if (!alumno) return;

        alumno.nombre = document.getElementById("nombre_blt").value.trim();
        alumno.curso = document.getElementById("curso_blt").value.trim();
        alumno.seccion = document.getElementById("seccion_blt").value.trim();

        cargarNotasDesdeTabla(alumno);
        cargarPromediosGeneralesEnAlumno(alumno);

    } else {
        // ➕ NUEVO
        const alumno = crearAlumnoDesdeFormulario();
        cargarNotasDesdeTabla(alumno);
        cargarPromediosGeneralesEnAlumno(alumno);
        alumnos.push(alumno);
    }

    guardarAlumnos(alumnos);

    limpiarBoletin();
    alumnoActivoId = null; // 🔁 reset
    ventana_notas.close();
    renderTable();
}



function guardarAlumnos(alumnos) {
    localStorage.setItem("alumnos", JSON.stringify(alumnos));
}

document.getElementById("guardarNotas").addEventListener("click", (e) => {
    e.preventDefault(); 
    guardarAlumnoCompleto();
});

document.getElementById("abrir-notas").addEventListener("click", () => {
    alumnoActivoId = null;   // 👈 nuevo alumno
    limpiarBoletin();        // 👈 borrar todo
    ventana_notas.showModal();
});


/***********************
* Lista de Alumnos
***********************/

function obtenerClasificacion(promedio) {
    if (promedio >= 90) return "A";
    if (promedio >= 80) return "B";
    if (promedio >= 70) return "C";
    return "D";
}


let alumnos = obtenerAlumnos();


const tbody = document.querySelector('#alumnosTable tbody');
const searchInput = document.getElementById('searchInput');
const cursoFilter = document.getElementById('cursoFilter');
const seccionFilter = document.getElementById('seccionFilter');
const ordenarBtn = document.getElementById('ordenarBtn');
const pageInfo = document.getElementById('pageInfo');

let asc = true;
let currentPage = 1;
const rowsPerPage = 5;

const ordenCursos = ["6to", "5to", "4to", "3ro", "2do"];

function populateFilters() {
    cursoFilter.innerHTML = `<option value="Todos">Curso</option>`;
    seccionFilter.innerHTML = `<option value="Todas">Seccion</option>`;

    let cursos = [...new Set(alumnos.map(a => a.curso))];
    const secciones = [...new Set(alumnos.map(a => a.seccion))];

    cursos.sort((a, b) => {
        const posA = ordenCursos.indexOf(a);
        const posB = ordenCursos.indexOf(b);

        if (posA === -1 && posB === -1) return 0;
        if (posA === -1) return 1;
        if (posB === -1) return -1;

        return posA - posB;
    });

    cursos.forEach(c => {
        cursoFilter.innerHTML += `<option value="${c}">${c}</option>`;
    });

    secciones.forEach(s => {
        seccionFilter.innerHTML += `<option value="${s}">${s}</option>`;
    });
}

function abrirBoletin(idAlumno) {
    const alumno = alumnos.find(a => a.id === idAlumno);
    if (!alumno) return;

    alumnoActivoId = idAlumno; 

    document.getElementById("nombre_blt").value = alumno.nombre;
    document.getElementById("curso_blt").value = alumno.curso;
    document.getElementById("seccion_blt").value = alumno.seccion;

    document
        .querySelectorAll("table.Nota tbody tr[data-materia]")
        .forEach(fila => {
            const materia = fila.dataset.materia;

            fila.querySelectorAll("input[type='number']").forEach(input => {
                const periodo = input.dataset.periodo;
                const notaIndex = Number(input.dataset.nota);

                input.value =
                    alumno.materias[materia][periodo][notaIndex] ?? "";
            });
        });

    ventana_notas.showModal();
}

function renderTable() {
    tbody.innerHTML = "";

    const texto = searchInput.value.toLowerCase();
    const cursoSel = cursoFilter.value;
    const seccionSel = seccionFilter.value;

    let filtrados = alumnos.filter(alumno => {
        const coincideNombre =
            alumno.nombre.toLowerCase().includes(texto);

        const coincideCurso =
            cursoSel === "Todos" || alumno.curso === cursoSel;

        const coincideSeccion =
            seccionSel === "Todas" || alumno.seccion === seccionSel;

        return coincideNombre && coincideCurso && coincideSeccion;
    });

    // Ordenar A-Z / Z-A
    filtrados.sort((a, b) =>
        asc
            ? a.nombre.localeCompare(b.nombre)
            : b.nombre.localeCompare(a.nombre)
    );

    filtrados.forEach(alumno => {
        const promedioFinal = alumno.promedios?.final ?? 0;
        const clasificacion = obtenerClasificacion(promedioFinal);

        const tr = document.createElement("tr");
        tr.dataset.id = alumno.id;

        tr.innerHTML = `
            <td class="td-nombre">
                <span class="nombre-texto">${alumno.nombre}</span>
            </td>
            <td>${alumno.curso}</td>
            <td>${alumno.seccion}</td>
            <td>${clasificacion}</td>
            <td class="td-promedio">
                ${formatearPromedio(promedioFinal)}
                <button class="menu-btn">⋮</button>
                <div class="menu-dropdown">
                    <div class="opcion eliminar">Eliminar</div>
                    <div class="opcion imprimir">Imprimir</div>
                </div>
            </td>
        `;

        // Evitar que el menú abra el boletín
        tr.querySelector(".menu-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            
            const dropdown = tr.querySelector(".menu-dropdown");
            dropdown.style.display =
                dropdown.style.display === "block" ? "none" : "block";
        });
        
        tr.querySelector(".eliminar").addEventListener("click", (e) => {
            e.stopPropagation();
                
            const confirmar = confirm("¿Seguro que deseas eliminar este alumno?");
            if (!confirmar) return;
            
            if (alumnoActivoId === alumno.id) {                    
                limpiarBoletin();
                alumnoActivoId = null;
            }

            alumnos = alumnos.filter(a => a.id !== alumno.id);
            guardarAlumnos(alumnos);
            renderTable();
            alert("Alumno eliminado correctamente ✅");
        });
        
        tr.addEventListener("click", () => {
            abrirBoletin(alumno.id);
        });
        
        tbody.appendChild(tr);
    });
}

document.addEventListener("click", () => {
    document.querySelectorAll(".menu-dropdown").forEach(menu => {
        menu.style.display = "none";
    });
});

// Eventos
searchInput.addEventListener('input', () => {
    currentPage = 1;
    renderTable();
});

cursoFilter.addEventListener('change', () => {
    currentPage = 1;
    renderTable();
});

seccionFilter.addEventListener('change', () => {
    currentPage = 1;
    renderTable();
});

ordenarBtn.addEventListener('click', () => {
    asc = !asc;
    ordenarBtn.textContent = asc ? 'Ordenar A→Z' : 'Ordenar Z→A';
    renderTable();
});

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    renderTable();
});

function limpiarBoletin() {
    // Limpiar inputs de notas
    document
        .querySelectorAll("table.Nota input[type='number']")
        .forEach(input => {
            input.value = "";
        });

    // Limpiar promedios visibles en la tabla
    document
        .querySelectorAll(".Nota tbody tr[data-materia] td")
        .forEach(td => {
            if (!td.querySelector("input")) {
                td.textContent = "";
            }
        });

    // Limpiar datos personales
    document.getElementById("nombre_blt").value = "";
    document.getElementById("curso_blt").value = "";
    document.getElementById("seccion_blt").value = "";
}

// Inicializar
populateFilters();
renderTable();



/* ======================
Ranking de Alumnos
====================== */




function cargarRanking() {
    const contenedor = document.getElementById('rankingList');
    if (!contenedor) return;

    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];

    // 🔹 obtener periodo seleccionado
    const select = document.getElementById('periodoSelect');
    const periodoSeleccionado = select ? select.value : 'final';

    // 🔹 filtrar y ordenar según el periodo seleccionado
    const ranking = alumnos
    .filter(a => a.promedios && !isNaN(Number(a.promedios[periodoSeleccionado])))
    .sort((a, b) => b.promedios[periodoSeleccionado] - a.promedios[periodoSeleccionado])
    .slice(0, 10); // ✅ limita el Top a 10


    if (ranking.length === 0) {
        contenedor.innerHTML = '<p>No hay alumnos con promedio aún.</p>';
        return;
    }

    contenedor.innerHTML = '';

    ranking.forEach((alumno, index) => {
        const promedio = Number(alumno.promedios[periodoSeleccionado]) || 0;

        const div = document.createElement('div');
        div.className = 'ranking-item';

        div.dataset.nombre = alumno.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (index === 0) div.classList.add('top-1');
        if (index === 1) div.classList.add('top-2');
        if (index === 2) div.classList.add('top-3');

        div.innerHTML = `
            <div class="ranking-left">

                <div class="ranking-medal"></div>

                <div class="ranking-avatar">
                    <img src="incognito.webp" alt="avatar">
                </div>

                <div class="ranking-info">
                    <span class="ranking-nombre">${alumno.nombre}</span>
                    <span class="ranking-curso">
                        ${alumno.curso} · ${alumno.seccion}
                    </span>
                </div>
                <div class="ranking-bar">
                    <div class="ranking-bar-fill"
                        style="width:${promedio}%">
                    </div>
                </div>
            </div>

            <div class="ranking-right">
                <span class="ranking-promedio">
                    ${formatearPromedio(promedio)}
                </span>
            </div>
        `;

        const barra = div.querySelector('.ranking-bar-fill');

        if (index === 0) barra.classList.add('bar-gold');
        else if (index === 1) barra.classList.add('bar-silver');
        else if (index === 2) barra.classList.add('bar-bronze');
        else barra.classList.add('bar-blue');

        const medal = div.querySelector('.ranking-medal');

        if (index === 0) medal.textContent = '🥇';
        else if (index === 1) medal.textContent = '🥈';
        else if (index === 2) medal.textContent = '🥉';
        else medal.textContent = index + 1;


        contenedor.appendChild(div);
    });
}

const selectPeriodo = document.getElementById('periodoSelect');
if (selectPeriodo) selectPeriodo.addEventListener('change', cargarRanking);

document.addEventListener('DOMContentLoaded', () => cargarRanking());



/* ======================
Top De Exelencia
====================== */







function asegurarPromediosMateria(alumno) {

    Object.values(alumno.materias).forEach(materia => {

        if (!materia.promedios) {
            materia.promedios = {
                p1: 0,
                p2: 0,
                p3: 0,
                p4: 0,
                final: 0
            };
        }

        calcularPromediosMateria(materia);
    });

    return alumno;
}

function cargarTopExcelencia() {

    const contenedor = document.getElementById('topExcelenciaList');
    if (!contenedor) return;

    const alumnos = JSON.parse(localStorage.getItem('alumnos')) || [];

    // 🔹 Obtener filtros
    const selectCursos = document.getElementById("grados-exelencia");
    const cursosSeleccionados = Array.from(selectCursos.selectedOptions)
        .map(o => o.value)
        .filter(v => v !== "");

    const materia = document.getElementById("asignaturas-exelencia").value;

    const gruposSeleccionados = obtenerGruposSeleccionados();

    // 🔹 FILTRAR
    let filtrados = alumnos;

    // Filtrar por cursos múltiples
    if (cursosSeleccionados.length > 0) {
        filtrados = filtrados.filter(a =>
            cursosSeleccionados.includes(a.curso)
        );
    }

    // Filtrar por grupo A / B
    if (gruposSeleccionados.length > 0) {
        filtrados = filtrados.filter(a =>
            gruposSeleccionados.includes(a.seccion)
        );
    }

    // 🔹 Si NO hay materia seleccionada → usar promedio general
    let ranking;

    if (!materia) {

        ranking = filtrados
            .filter(a => a.promedios && !isNaN(Number(a.promedios.final)))
            .sort((a, b) => b.promedios.final - a.promedios.final)

    } else {

        ranking = filtrados
            .filter(a =>
                a.materias &&
                a.materias[materia] &&
                a.materias[materia].promedios
            )
            .sort((a, b) =>
                b.materias[materia].promedios.final -
                a.materias[materia].promedios.final
            )
    }

    if (ranking.length === 0) {
        contenedor.innerHTML = '<p>No hay datos aún.</p>';
        return;
    }

    contenedor.innerHTML = '';

    ranking.forEach((alumno, index) => {

        let promedio;

        if (!materia) {
            promedio = Number(alumno.promedios.final) || 0;
        } else {
            promedio = Number(
                alumno.materias[materia].promedios.final
            ) || 0;
        }

        const div = document.createElement('div');
        div.className = 'ranking-item';
        div.dataset.nombre = alumno.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        if (index === 0) div.classList.add('top-1');
        if (index === 1) div.classList.add('top-2');
        if (index === 2) div.classList.add('top-3');

        div.innerHTML = `
            <div class="ranking-left">

                <div class="ranking-medal"></div>

                <div class="ranking-avatar">
                    <img src="incognito.webp" alt="avatar">
                </div>

                <div class="ranking-info">
                    <span class="ranking-nombre">${alumno.nombre}</span>
                    <span class="ranking-curso">
                        ${alumno.curso} · ${alumno.seccion}
                    </span>
                </div>

                <div class="ranking-bar">
                    <div class="ranking-bar-fill"
                        style="width:${promedio}%">
                    </div>
                </div>
            </div>

            <div class="ranking-right">
                <span class="ranking-promedio">
                    ${promedio.toFixed(1)}
                </span>
            </div>
        `;

        const barra = div.querySelector('.ranking-bar-fill');
        const medal = div.querySelector('.ranking-medal');

        if (index === 0) {
            barra.classList.add('bar-gold');
            medal.textContent = '🥇';
        } 
        else if (index === 1) {
            barra.classList.add('bar-silver');
            medal.textContent = '🥈';
        } 
        else if (index === 2) {
            barra.classList.add('bar-bronze');
            medal.textContent = '🥉';
        } 
        else {
            barra.classList.add('bar-blue');
            medal.textContent = index + 1;
        }

        contenedor.appendChild(div);
    });
}

function rankingMateriaPeriodo(materia, periodo) {
    const alumnos = obtenerAlumnos();

    return alumnos.sort((a,b) =>
        b.materias[materia].promedios[periodo] -
        a.materias[materia].promedios[periodo]
    );
}

function obtenerGruposSeleccionados() {
    const botonesActivos = document.querySelectorAll(".toggle-grupo button.active");

    return Array.from(botonesActivos)
        .map(btn => btn.textContent.trim());
}

function obtenerGrupoActivo() {
    const botones = document.querySelectorAll(".toggle-grupo button");

    for (let btn of botones) {
        if (btn.classList.contains("active")) {
            return btn.textContent.trim();
        }
    }

    return null;
}


document.querySelectorAll(".toggle-grupo button")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            const estaActivo = btn.classList.contains("active");

            // Primero quitar active a ambos
            document.querySelectorAll(".toggle-grupo button")
                .forEach(b => b.classList.remove("active"));

            //  Si NO estaba activo, lo activamos
            if (!estaActivo) {
                btn.classList.add("active");
            }

            cargarTopExcelencia();
        });

    });


document.getElementById("grados-exelencia")
.addEventListener("change", cargarTopExcelencia);

document.getElementById("asignaturas-exelencia")
.addEventListener("change", cargarTopExcelencia);

/* ======================
Movimiento en el sitio
====================== */




const iconos = document.querySelectorAll('.icon-box');
const vistas = document.querySelectorAll('.vista');

iconos.forEach(icono => {
    icono.addEventListener('click', () => {

        const vistaId = icono.dataset.vista;
        if (!vistaId) return;

        // quitar active
        iconos.forEach(i => i.classList.remove('active'));
        vistas.forEach(v => v.classList.remove('active'));

        // activar seleccionados
        icono.classList.add('active');
        document.getElementById(vistaId).classList.add('active');

        localStorage.setItem('vistaActiva', vistaId);

        if (vistaId === 'vista-ranking') {
            cargarRanking();
            cargarTopExcelencia();
        }       
    });
});


/* ======================
Transsicion de Listas
====================== */



document.addEventListener("DOMContentLoaded", () => {

    const botonExcelencia = document.querySelector('.lista-excelencia');
    const ranking = document.querySelector('.ranking-card');
    const top = document.querySelector('.top-card');

    botonExcelencia.addEventListener('click', () => {

    const estoyEnTop = top.classList.contains('active');

    if (estoyEnTop) {
        // Volver a ranking
        top.classList.remove('active');
        ranking.classList.add('active');
    } else {
        // Ir a top
        ranking.classList.remove('active');
        top.classList.add('active');
        cargarTopExcelencia();
    }

    });

});


/* ======================
Buscador del Top
====================== */


document.addEventListener("DOMContentLoaded", () => {

    const buscadorExcelencia = document.getElementById("buscadorExcelencia");

    if (!buscadorExcelencia) return;

    buscadorExcelencia.addEventListener("input", function () {

        const texto = this.value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        const filas = document.querySelectorAll("#topExcelenciaList .ranking-item");

        filas.forEach(fila => {

            const nombre = fila.dataset.nombre || "";

            fila.style.display = nombre.includes(texto)
                ? "flex"
                : "none";

        });

    });

});





























window.addEventListener('DOMContentLoaded', () => {
    const vistaGuardada = localStorage.getItem('vistaActiva');

    if (vistaGuardada) {
        // quitar active de todas
        iconos.forEach(i => i.classList.remove('active'));
        vistas.forEach(v => v.classList.remove('active'));

        // activar la vista guardada
        const icono = document.querySelector(`.icon-box[data-vista="${vistaGuardada}"]`);
        const vista = document.getElementById(vistaGuardada);

        if (icono && vista) {
            icono.classList.add('active');
            vista.classList.add('active');

            // Si es ranking, cargar ranking
            if (vistaGuardada === 'vista-ranking') {
                cargarRanking();
            }
        }
    }
});