import * as readline from "readline";
import { Tarea, EstadoTarea, DificultadTarea } from "../models/tarea";
import { GestorTareas } from "../services/managerTareas";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Permite solicitar información al usuario mediante la terminal.
function preguntar(mensaje: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(mensaje, resolve);
    });
}

// Comprueba si una fecha ingresada es válida.
function fechaValida(fecha: string): boolean {
    if (fecha.trim() === "") {
        return false;
    }

    return !Number.isNaN(new Date(fecha).getTime());
}

export async function agregarTarea(gestor: GestorTareas): Promise<void> {
    console.log("\n--- AGREGAR NUEVA TAREA ---");

    try {
        // Solicita los datos básicos.
        const titulo = (await preguntar("Título: ")).trim();

        if (titulo === "") {
            console.log("El título no puede estar vacío.");
            return;
        }

        const descripcionIngresada = await preguntar(
            "Descripción (dejar vacío si no tiene): "
        );

        const descripcion =
            descripcionIngresada.trim() === ""
                ? null
                : descripcionIngresada.trim();

        // Solicita y valida el estado.
        console.log("\nEstados disponibles:");
        console.log("1. PENDING");
        console.log("2. IN-PROGRESS");
        console.log("3. FINISHED");
        console.log("4. CANCELED");

        const opcionEstado = await preguntar("Seleccione un estado: ");

        const estados: EstadoTarea[] = [
            "PENDING",
            "IN-PROGRESS",
            "FINISHED",
            "CANCELED"
        ];

        const estado = estados[Number(opcionEstado) - 1];

        if (!estado) {
            console.log("Estado inválido.");
            return;
        }

        // Solicita y valida la dificultad.
        console.log("\nDificultad:");
        console.log("1. Fácil");
        console.log("2. Media");
        console.log("3. Difícil");

        const opcionDificultad = Number(
            await preguntar("Seleccione una dificultad: ")
        );

        if (![1, 2, 3].includes(opcionDificultad)) {
            console.log("Dificultad inválida.");
            return;
        }

        const dificultad = opcionDificultad as DificultadTarea;

        // Registra la fecha actual como fecha de creación.
        const creacion = new Date().toISOString();

        // Una tarea nueva todavía no tiene una fecha de última edición.
        const ultimaEdicion = null;

        // Solicita una fecha de vencimiento opcional.
        const vencimientoIngresado = await preguntar(
            "Fecha de vencimiento (YYYY-MM-DD o vacío si no tiene): "
        );

        let vencimiento: string | null = null;

        if (vencimientoIngresado.trim() !== "") {
            if (!fechaValida(vencimientoIngresado)) {
                console.log("La fecha de vencimiento no es válida.");
                return;
            }

            vencimiento = vencimientoIngresado.trim();
        }

        // Construye el objeto con el formato del nuevo tasks.json.
        const nuevaTarea = new Tarea(
            titulo,
            descripcion,
            estado,
            creacion,
            ultimaEdicion,
            vencimiento,
            dificultad
        );

        // Agrega la tarea y guarda los cambios.
        gestor.agregarTarea(nuevaTarea);

        console.log("\nTarea agregada correctamente.");

    } catch (error) {
        console.error("No se pudo agregar la tarea:", error);
    }
}
