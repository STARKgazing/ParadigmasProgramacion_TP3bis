import * as readline from "readline";
import { GestorTareas } from "../services/managerTareas";
import { Tarea } from "../models/tarea";
import { mostrarDetallesTarea } from "./verTarea";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Normaliza el texto para facilitar las búsquedas.
// Ignora mayúsculas, minúsculas y tildes.
function normalizarTexto(texto: string): string {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Permite solicitar información mediante la terminal.
function preguntar(mensaje: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(mensaje, resolve);
    });
}

// Busca tareas utilizando el gestor compartido.
export async function buscarTarea(gestor: GestorTareas): Promise<void> {
    console.log("\n=== BUSCAR TAREA ===");

    const tareas = gestor.cargarTareas();

    if (tareas.length === 0) {
        console.log("No hay tareas para buscar.");
        return;
    }

    let continuarBuscando = true;

    while (continuarBuscando) {
        const busqueda = await preguntar(
            "\nEscribí el título o palabra clave (0 para volver): "
        );

        if (busqueda.trim() === "0") {
            break;
        }

        if (busqueda.trim() === "") {
            console.log("La búsqueda no puede estar vacía.");
            continue;
        }

        const textoBuscado = normalizarTexto(busqueda);

        // Busca coincidencias en títulos y descripciones.
        // Si la descripción es null, se considera texto vacío.
        const resultados: Tarea[] = tareas.filter((tarea) => {
            const titulo = normalizarTexto(tarea.titulo);
            const descripcion = normalizarTexto(
                tarea.descripcion ?? ""
            );

            return (
                titulo.includes(textoBuscado) ||
                descripcion.includes(textoBuscado)
            );
        });

        console.log("\n=== RESULTADOS DE BÚSQUEDA ===");

        if (resultados.length === 0) {
            console.log("No se encontraron tareas.");
            continue;
        }

        resultados.forEach((tarea, indice) => {
            console.log(`${indice + 1}. ${tarea.titulo}`);
        });

        console.log("\nB. Buscar nuevamente");
        console.log("0. Volver al menú principal");

        const opcion = await preguntar("Elegí una opción: ");

        if (opcion.toUpperCase() === "B") {
            continue;
        }

        if (opcion === "0") {
            break;
        }

        const numeroTarea = Number(opcion);

        if (
            !Number.isInteger(numeroTarea) ||
            numeroTarea < 1 ||
            numeroTarea > resultados.length
        ) {
            console.log("Opción inválida.");
            continue;
        }

        // Muestra los detalles de la tarea seleccionada.
        const tareaSeleccionada = resultados[numeroTarea - 1];

        if (tareaSeleccionada) {
            mostrarDetallesTarea(tareaSeleccionada);
        }
    }

    rl.close();
}
