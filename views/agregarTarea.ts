import { Tarea, EstadoTarea, DificultadTarea } from "../models/tarea";
import { GestorTareas } from "../services/managerTareas";

interface Readline {
    question(
        pregunta: string,
        callback: (respuesta: string) => void
    ): void;
}

export function agregarTarea(
    rl: Readline,
    volverAlMenu: () => void
): void {
    const gestor = new GestorTareas();

    // 1. Pedir el título
    rl.question("Título: ", (titulo: string) => {
        if (titulo.trim() === "") {
            console.log("El título no puede estar vacío.");
            return agregarTarea(rl, volverAlMenu);
        }

        // 2. Pedir la descripción
        rl.question("Descripción: ", (descripcion: string) => {
            if (descripcion.length > 200) {
                console.log(
                    "La descripción no puede superar los 200 caracteres."
                );
                return agregarTarea(rl, volverAlMenu);
            }

            // 3. Elegir el estado
            console.log("\n=== ESTADO ===");
            console.log("1. Pendiente");
            console.log("2. En proceso");
            console.log("3. Finalizada");

            rl.question("Elegí un estado: ", (opcionEstado: string) => {
                let estado: EstadoTarea;

                switch (opcionEstado) {
                    case "1":
                        estado = "Pendiente";
                        break;
                    case "2":
                        estado = "En proceso";
                        break;
                    case "3":
                        estado = "Finalizada";
                        break;
                    default:
                        console.log("Opción inválida.");
                        return agregarTarea(rl, volverAlMenu);
                }

                // 4. Elegir la dificultad
                console.log("\n=== DIFICULTAD ===");
                console.log("1. Facil");
                console.log("2. Medio");
                console.log("3. Dificil");

                rl.question(
                    "Elegí una dificultad: ",
                    (opcionDificultad: string) => {
                        let dificultad: DificultadTarea;

                        switch (opcionDificultad) {
                            case "1":
                                dificultad = "Facil";
                                break;
                            case "2":
                                dificultad = "Medio";
                                break;
                            case "3":
                                dificultad = "Dificil";
                                break;
                            default:
                                console.log("Opción inválida.");
                                return agregarTarea(rl, volverAlMenu);
                        }

                        // 5. Crear una instancia de Tarea
                        const tarea = new Tarea(
                            titulo,
                            descripcion,
                            estado,
                            dificultad,
                            new Date().toISOString().split("T")[0]!,
                            null
                        );

                        // 6. Guardar la tarea a través del gestor
                        gestor.agregarTarea(tarea);

                        console.log("\n¡Tarea agregada exitosamente!");
                        console.log(tarea);

                        // 7. Volver al menú
                        rl.question(
                            "\nPresiona ENTER para volver al menú principal...",
                            () => volverAlMenu()
                        );
                    }
                );
            });
        });
    });
}
