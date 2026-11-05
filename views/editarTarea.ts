
import {
    Tarea,
    EstadoTarea,
    DificultadTarea
} from "../models/tarea";

import { GestorTareas } from "../services/managerTareas";

interface Readline {
    question(
        pregunta: string,
        callback: (respuesta: string) => void
    ): void;

    close(): void;
}

function estaEnBlanco(valor: string): boolean {
    return valor.trim() === "";
}

// Editar título
function editarTitulo(
    rl: Readline,
    tarea: Tarea,
    continuar: (titulo: string) => void
): void {
    rl.question(
        `Título [${tarea.titulo}]: `,
        (nuevoTitulo: string) => {
            if (nuevoTitulo === "") {
                continuar(tarea.titulo);
                return;
            }

            if (estaEnBlanco(nuevoTitulo)) {
                console.log("El título no puede estar vacío.");
                editarTitulo(rl, tarea, continuar);
                return;
            }

            continuar(nuevoTitulo);
        }
    );
}

// Editar descripción
function editarDescripcion(
    rl: Readline,
    tarea: Tarea,
    continuar: (descripcion: string) => void
): void {
    rl.question(
        `Descripción [${tarea.descripcion}]: `,
        (nuevaDescripcion: string) => {
            if (nuevaDescripcion === "") {
                continuar(tarea.descripcion);
                return;
            }

            // Mantener el comportamiento del programa original.
            if (estaEnBlanco(nuevaDescripcion)) {
                continuar("empty");
                return;
            }

            if (nuevaDescripcion.length > 200) {
                console.log(
                    "La descripción no puede superar los 200 caracteres."
                );

                editarDescripcion(rl, tarea, continuar);
                return;
            }

            continuar(nuevaDescripcion);
        }
    );
}

// Editar estado
function editarEstado(
    rl: Readline,
    tarea: Tarea,
    continuar: (estado: EstadoTarea) => void
): void {
    console.log("\n=== ESTADO ===");
    console.log(`Estado actual: ${tarea.estado}`);
    console.log("1. Pendiente");
    console.log("2. En proceso");
    console.log("3. Finalizada");

    rl.question(
        "Elegí un estado (ENTER para mantener): ",
        (opcion: string) => {
            if (opcion === "") {
                continuar(tarea.estado);
                return;
            }

            switch (opcion) {
                case "1":
                    continuar("Pendiente");
                    break;
                case "2":
                    continuar("En proceso");
                    break;
                case "3":
                    continuar("Finalizada");
                    break;
                default:
                    console.log("Opción inválida.");
                    editarEstado(rl, tarea, continuar);
            }
        }
    );
}

// Editar dificultad
function editarDificultad(
    rl: Readline,
    tarea: Tarea,
    continuar: (dificultad: DificultadTarea) => void
): void {
    console.log("\n=== DIFICULTAD ===");
    console.log(`Dificultad actual: ${tarea.dificultad}`);
    console.log("1. Facil");
    console.log("2. Medio");
    console.log("3. Dificil");

    rl.question(
        "Elegí una dificultad (ENTER para mantener): ",
        (opcion: string) => {
            if (opcion === "") {
                continuar(tarea.dificultad);
                return;
            }

            switch (opcion) {
                case "1":
                    continuar("Facil");
                    break;
                case "2":
                    continuar("Medio");
                    break;
                case "3":
                    continuar("Dificil");
                    break;
                default:
                    console.log("Opción inválida.");
                    editarDificultad(rl, tarea, continuar);
            }
        }
    );
}

// Editar fecha de finalización
function editarFechaFinalizacion(
    rl: Readline,
    tarea: Tarea,
    continuar: (fecha: string | null) => void
): void {
    rl.question(
        `Fecha de finalización [${tarea.fechaFinalizacion || "sin fecha"}]: `,
        (nuevaFecha: string) => {
            // ENTER = mantener la fecha actual
            if (nuevaFecha === "") {
                continuar(tarea.fechaFinalizacion);
                return;
            }

            // Espacios + ENTER = quitar la fecha
            if (estaEnBlanco(nuevaFecha)) {
                continuar(null);
                return;
            }

            // Validar el formato YYYY-MM-DD
            if (!/^\d{4}-\d{2}-\d{2}$/.test(nuevaFecha)) {
                console.log(
                    "La fecha debe tener el formato YYYY-MM-DD."
                );

                editarFechaFinalizacion(rl, tarea, continuar);
                return;
            }

            // Comprobar que sea una fecha real del calendario
            const fecha = new Date(`${nuevaFecha}T00:00:00`);
            const fechaNormalizada =
                `${fecha.getFullYear()}-${String(
                    fecha.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    fecha.getDate()
                ).padStart(2, "0")}`;

            if (
                isNaN(fecha.getTime()) ||
                fechaNormalizada !== nuevaFecha
            ) {
                console.log("La fecha no es válida.");
                editarFechaFinalizacion(rl, tarea, continuar);
                return;
            }

            // La fecha final no puede ser anterior a la creación
            if (nuevaFecha < tarea.fechaCreacion) {
                console.log(
                    "La fecha de finalización no puede ser anterior " +
                    "a la fecha de creación."
                );

                editarFechaFinalizacion(rl, tarea, continuar);
                return;
            }

            continuar(nuevaFecha);
        }
    );
}

// Comenzar edición
function editarTarea(
    rl: Readline,
    tarea: Tarea,
    tareas: Tarea[],
    volverAlMenu: () => void
): void {
    const gestor = new GestorTareas();

    console.log("\n=== EDITAR TAREA ===");
    console.log("ENTER = mantener el valor actual.");
    console.log(
        "ESPACIO + ENTER = dejar vacío cuando sea posible."
    );
    console.log("");

    editarTitulo(rl, tarea, (nuevoTitulo: string) => {
        editarDescripcion(
            rl,
            tarea,
            (nuevaDescripcion: string) => {
                editarEstado(
                    rl,
                    tarea,
                    (nuevoEstado: EstadoTarea) => {
                        editarDificultad(
                            rl,
                            tarea,
                            (nuevaDificultad: DificultadTarea) => {
                                editarFechaFinalizacion(
                                    rl,
                                    tarea,
                                    (nuevaFechaFinalizacion: string | null) => {
                                        try {
                                            // Actualizar mediante los métodos de Tarea
                                            tarea.actualizarTitulo(nuevoTitulo);
                                            tarea.actualizarDescripcion(
                                                nuevaDescripcion
                                            );
                                            tarea.actualizarEstado(nuevoEstado);
                                            tarea.actualizarDificultad(
                                                nuevaDificultad
                                            );

                                            // Se asigna después del estado porque
                                            // actualizarEstado puede modificarla.
                                            tarea.actualizarFechaFinalizacion(
                                                nuevaFechaFinalizacion
                                            );

                                            // La fecha de creación no cambia.
                                            gestor.guardarTareas(tareas);

                                            console.log(
                                                "\n¡Tarea modificada exitosamente!"
                                            );
                                            console.log(
                                                "\n=== TAREA ACTUALIZADA ==="
                                            );
                                            console.log(
                                                `Título: ${tarea.titulo}`
                                            );
                                            console.log(
                                                `Descripción: ${tarea.descripcion}`
                                            );
                                            console.log(
                                                `Estado: ${tarea.estado}`
                                            );
                                            console.log(
                                                `Dificultad: ${tarea.dificultad}`
                                            );
                                            console.log(
                                                `Fecha de creación: ${tarea.fechaCreacion}`
                                            );
                                            console.log(
                                                "Fecha de finalización: " +
                                                (
                                                    tarea.fechaFinalizacion ||
                                                    "sin fecha"
                                                )
                                            );

                                            console.log(
                                                "\n0. Volver al menú principal"
                                            );

                                            rl.question(
                                                "Elegí una opción: ",
                                                (opcion: string) => {
                                                    if (opcion === "0") {
                                                        volverAlMenu();
                                                        return;
                                                    }

                                                    console.log(
                                                        "Opción inválida."
                                                    );

                                                    editarTarea(
                                                        rl,
                                                        tarea,
                                                        tareas,
                                                        volverAlMenu
                                                    );
                                                }
                                            );
                                        } catch (error) {
                                            console.log(
                                                "No se pudo actualizar la tarea:",
                                                error instanceof Error
                                                    ? error.message
                                                    : error
                                            );
                                        }
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    });
}

export { editarTarea };
