import * as readline from "readline";

import { GestorTareas } from "./services/managerTareas";
import { agregarTarea } from "./views/agregarTarea";
import { editarTarea } from "./views/editarTarea";
import { buscarTarea } from "./views/buscarTarea";
import { verTareas } from "./views/verTarea";

// Solicita una opción al usuario mediante la terminal.
function preguntar(mensaje: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(mensaje, (respuesta) => {
            rl.close();
            resolve(respuesta);
        });
    });
}

// Menú principal de la aplicación.
async function menuPrincipal(gestor: GestorTareas): Promise<void> {
    let continuar = true;

    while (continuar) {
        console.log("\n========== TO DO LIST ==========");
        console.log("1. Ver mis tareas");
        console.log("2. Buscar una tarea");
        console.log("3. Agregar una tarea");
        console.log("4. Editar una tarea");
        console.log("0. Salir");

        const opcion = await preguntar("\nSeleccione una opción: ");

        try {
            switch (opcion) {
                case "1":
                    await verTareas(gestor.cargarTareas());
                    break;

                case "2":
                    await buscarTarea(gestor);                    
		break;

                case "3":
                    await agregarTarea(gestor);
                    break;

                case "4":
                    await editarTarea(gestor);
                    break;

                case "0":
                    continuar = false;
                    console.log("\n¡Hasta luego!");
                    break;

                default:
                    console.log("\nOpción inválida.");
            }
        } catch (error) {
            console.error("\nOcurrió un error:", error);
        }
    }
}

// Punto de entrada del programa.
async function main(): Promise<void> {
    try {
        // Crea un único gestor y carga las tareas desde tasks.json.
        const gestor = new GestorTareas();

        // Inicia el menú principal.
        await menuPrincipal(gestor);

    } catch (error) {
        console.error("\nNo se pudo iniciar la aplicación:");

        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(error);
        }
    }
}

main();
