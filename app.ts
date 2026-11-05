import { verTareas } from "./views/verTarea";
import { buscarTarea } from "./views/buscarTarea";
import { agregarTarea } from "./views/agregarTarea";

import * as readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainMenu(): void {
    console.log("\n=== TO DO LIST ===");
    console.log("1. Ver mis tareas");
    console.log("2. Buscar una Tarea");
    console.log("3. Agregar una tarea");
    console.log("0. Salir");

    rl.question("Choose an option: ", (answer: string) => {
        const option: number = Number(answer);

        switch (option) {
            case 1:
                verTareas(rl, mainMenu);
                break;

            case 2:
                buscarTarea(rl, mainMenu);
                break;

            case 3:
                agregarTarea(rl, mainMenu);
                break;

            case 0:
                console.log("Prende y Apaga la luz!");
                rl.close();
                break;

            default:
                console.log("Opción inválida.");
                mainMenu();
        }
    });
}

mainMenu();

