import * as readline from "readline";
import { Tarea, EstadoTarea, DificultadTarea } from "../models/tarea";
import { GestorTareas } from "../services/managerTareas";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function preguntar(mensaje: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(mensaje, resolve);
    });
}

function fechaValida(fecha: string): boolean {
    if (fecha.trim() === "") {
        return false;
    }

    return !Number.isNaN(new Date(fecha).getTime());
}

export async function editarTarea(gestor: GestorTareas): Promise<void> {
    console.log("\n--- EDITAR TAREA ---");

    try {
        const tareas = gestor.cargarTareas();

        if (tareas.length === 0) {
            console.log("No hay tareas para editar.");
            return;
        }

        // Muestra las tareas disponibles con sus índices.
        tareas.forEach((tarea, indice) => {
            console.log(`${indice + 1}. ${tarea.titulo} [${tarea.estado}]`);
        });

        const opcion = Number(
            await preguntar("\nSeleccione el número de la tarea: ")
        );

        const indice = opcion - 1;

        if (
            !Number.isInteger(opcion) ||
            indice < 0 ||
            indice >= tareas.length
        ) {
            console.log("Número de tarea inválido.");
            return;
        }

        const tareaOriginal = tareas[indice];

        console.log("\nDeje vacío un campo para conservar su valor actual.");

        // Solicita los nuevos valores.
        const tituloIngresado = await preguntar(
            `Título (${tareaOriginal.titulo}): `
        );

        const descripcionIngresada = await preguntar(
            `Descripción (${tareaOriginal.descripcion ?? "Sin descripción"}): `
        );

        // Permite modificar el estado.
        console.log("\nEstados disponibles:");
        console.log("1. PENDING");
        console.log("2. IN-PROGRESS");
        console.log("3. FINISHED");
        console.log("4. CANCELED");

        const estadoIngresado = await preguntar(
            `Estado actual: ${tareaOriginal.estado}. Nuevo estado (1-4): `
        );

        const estados: EstadoTarea[] = [
            "PENDING",
            "IN-PROGRESS",
            "FINISHED",
            "CANCELED"
        ];

        let nuevoEstado = tareaOriginal.estado;

        if (estadoIngresado.trim() !== "") {
            const estadoSeleccionado = estados[Number(estadoIngresado) - 1];

            if (!estadoSeleccionado) {
                console.log("Estado inválido.");
                return;
            }

            nuevoEstado = estadoSeleccionado;
        }

        // Permite modificar la dificultad.
        console.log("\nDificultad:");
        console.log("1. Fácil");
        console.log("2. Media");
        console.log("3. Difícil");

        const dificultadIngresada = await preguntar(
            `Dificultad actual: ${tareaOriginal.dificultad}. Nueva dificultad (1-3): `
        );

        let nuevaDificultad = tareaOriginal.dificultad;

        if (dificultadIngresada.trim() !== "") {
            const valor = Number(dificultadIngresada);

            if (![1, 2, 3].includes(valor)) {
                console.log("Dificultad inválida.");
                return;
            }

            nuevaDificultad = valor as DificultadTarea;
        }

        // Permite modificar la fecha de creación.
        const creacionIngresada = await preguntar(
            `Fecha de creación (${tareaOriginal.creacion}): `
        );

        let nuevaCreacion = tareaOriginal.creacion;

        if (creacionIngresada.trim() !== "") {
            if (!fechaValida(creacionIngresada)) {
                console.log("La fecha de creación no es válida.");
                return;
            }

            nuevaCreacion = creacionIngresada.trim();
        }

        // Permite modificar la última edición.
        // Su valor se actualizará automáticamente al guardar.
        const vencimientoIngresado = await preguntar(
            `Fecha de vencimiento (${tareaOriginal.vencimiento ?? "Sin vencimiento"}): `
        );

        let nuevoVencimiento = tareaOriginal.vencimiento;

        if (vencimientoIngresado.trim() !== "") {
            if (vencimientoIngresado.trim().toUpperCase() === "NULL") {
                nuevoVencimiento = null;
            } else {
                if (!fechaValida(vencimientoIngresado)) {
                    console.log("La fecha de vencimiento no es válida.");
                    return;
                }

                nuevoVencimiento = vencimientoIngresado.trim();
            }
        }

        // Conserva la descripción si no se ingresó un nuevo valor.
        // Es posible escribir NULL para eliminarla.
        let nuevaDescripcion = tareaOriginal.descripcion;

        if (descripcionIngresada.trim() !== "") {
            nuevaDescripcion =
                descripcionIngresada.trim().toUpperCase() === "NULL"
                    ? null
                    : descripcionIngresada.trim();
        }

        const nuevoTitulo =
            tituloIngresado.trim() === ""
                ? tareaOriginal.titulo
                : tituloIngresado.trim();

        // Construye la tarea actualizada.
        const tareaActualizada = new Tarea(
            nuevoTitulo,
            nuevaDescripcion,
            nuevoEstado,
            nuevaCreacion,
            new Date().toISOString(),
            nuevoVencimiento,
            nuevaDificultad
        );

        // Reemplaza la tarea y guarda los cambios.
        gestor.editarTarea(indice, tareaActualizada);

        console.log("\nTarea modificada correctamente.");

    } catch (error) {
        console.error("No se pudo editar la tarea:", error);
    }
}
