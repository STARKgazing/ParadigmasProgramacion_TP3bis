import * as readline from "readline";
import { Tarea, EstadoTarea } from "../models/tarea";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function preguntar(mensaje: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(mensaje, resolve);
    });
}

// Traduce los estados para mostrarlos de forma legible.
function mostrarEstado(estado: EstadoTarea): string {
    const estados: Record<EstadoTarea, string> = {
        "PENDING": "Pendiente",
        "IN-PROGRESS": "En proceso",
        "FINISHED": "Finalizada",
        "CANCELED": "Cancelada"
    };

    return estados[estado];
}

// Traduce la dificultad numérica para mostrarla al usuario.
function mostrarDificultad(dificultad: number): string {
    const dificultades: Record<number, string> = {
        1: "Fácil",
        2: "Media",
        3: "Difícil"
    };

    return dificultades[dificultad] ?? "Desconocida";
}

// Muestra todos los detalles de una tarea.
export function mostrarDetallesTarea(tarea: Tarea): void {
    console.log("-----------------------------------");
    console.log(`Título: ${tarea.titulo}`);
    console.log(`Descripción: ${tarea.descripcion ?? "Sin descripción"}`);
    console.log(`Estado: ${mostrarEstado(tarea.estado)}`);
    console.log(`Creación: ${tarea.creacion}`);
    console.log(`Última edición: ${tarea.ultimaEdicion ?? "Sin modificaciones"}`);
    console.log(`Vencimiento: ${tarea.vencimiento ?? "Sin vencimiento"}`);
    console.log(`Dificultad: ${mostrarDificultad(tarea.dificultad)}`);
    console.log("-----------------------------------");
}

export async function verTareas(tareas: Tarea[]): Promise<void> {
    console.log("\n--- VER MIS TAREAS ---");

    if (tareas.length === 0) {
        console.log("No hay tareas registradas.");
        return;
    }

    console.log("1. Ver todas");
    console.log("2. Ver pendientes");
    console.log("3. Ver en proceso");
    console.log("4. Ver finalizadas");
    console.log("5. Ver canceladas");
    console.log("0. Volver");

    const opcion = await preguntar("\nSeleccione una opción: ");

    let tareasFiltradas: Tarea[] = [];

    switch (opcion) {
        case "1":
            tareasFiltradas = tareas;
            break;
        case "2":
            tareasFiltradas = tareas.filter(
                (tarea) => tarea.estado === "PENDING"
            );
            break;
        case "3":
            tareasFiltradas = tareas.filter(
                (tarea) => tarea.estado === "IN-PROGRESS"
            );
            break;
        case "4":
            tareasFiltradas = tareas.filter(
                (tarea) => tarea.estado === "FINISHED"
            );
            break;
        case "5":
            tareasFiltradas = tareas.filter(
                (tarea) => tarea.estado === "CANCELED"
            );
            break;
        case "0":
            return;
        default:
            console.log("Opción inválida.");
            return;
    }

    if (tareasFiltradas.length === 0) {
        console.log("No hay tareas que coincidan con ese estado.");
        return;
    }

    console.log(`\nSe encontraron ${tareasFiltradas.length} tarea(s):`);

    tareasFiltradas.forEach((tarea, indice) => {
        console.log(`\nTarea ${indice + 1}:`);
        mostrarDetallesTarea(tarea);
    });
}
