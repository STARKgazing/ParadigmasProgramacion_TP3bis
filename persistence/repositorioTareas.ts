import * as fs from "fs";
import * as path from "path";
import { Tarea, EstadoTarea, DificultadTarea } from "../models/tarea";

export class RepositorioTareas {
    private rutaArchivo: string;

    constructor() {
        // Ubicación del archivo JSON original.
        this.rutaArchivo = path.join(__dirname, "../tasks.json");
    }

    // Comprueba que una fecha sea válida sin modificar su valor original.
    private fechaValida(fecha: string): boolean {
        if (typeof fecha !== "string" || fecha.trim() === "") {
            return false;
        }

        const valorFecha = new Date(fecha);

        return !Number.isNaN(valorFecha.getTime());
    }

    // Valida que una tarea cumpla con el formato solicitado.
    private validarTarea(datos: any, indice: number): void {
        const estadosValidos: EstadoTarea[] = [
            "PENDING",
            "IN-PROGRESS",
            "FINISHED",
            "CANCELED"
        ];

        const dificultadesValidas: DificultadTarea[] = [1, 2, 3];

        if (typeof datos !== "object" || datos === null || Array.isArray(datos)) {
            throw new Error(`La tarea en la posición ${indice} no es un objeto válido.`);
        }

        if (typeof datos.titulo !== "string" || datos.titulo.trim() === "") {
            throw new Error(`La tarea en la posición ${indice} tiene un título inválido.`);
        }

        if (
            datos.descripcion !== null &&
            typeof datos.descripcion !== "string"
        ) {
            throw new Error(`La descripción de la tarea ${indice} debe ser texto o null.`);
        }

        if (!estadosValidos.includes(datos.estado)) {
            throw new Error(`El estado de la tarea ${indice} no es válido.`);
        }

        if (!this.fechaValida(datos.creacion)) {
    throw new Error(`La fecha de creación de la tarea ${indice} no es válida. ` + `Valor recibido: ${JSON.stringify(datos.creacion)}`
    );
}
        if (
            datos.ultimaEdicion !== null &&
            !this.fechaValida(datos.ultimaEdicion)
        ) {
            throw new Error(`La última edición de la tarea ${indice} no es válida.`);
        }

        if (
            datos.vencimiento !== null &&
            !this.fechaValida(datos.vencimiento)
        ) {
            throw new Error(`El vencimiento de la tarea ${indice} no es válido.`);
        }

        if (!dificultadesValidas.includes(datos.dificultad)) {
            throw new Error(`La dificultad de la tarea ${indice} debe ser 1, 2 o 3.`);
        }
    }

    cargarTareas(): Tarea[] {
        try {
            // Lee el contenido del archivo.
            const contenido = fs.readFileSync(this.rutaArchivo, "utf-8");

            // Convierte el texto JSON en datos de JavaScript.
            const datos = JSON.parse(contenido);

            // Comprueba que el archivo contenga un arreglo.
            if (!Array.isArray(datos)) {
                throw new Error("El contenido de tasks.json debe ser un arreglo.");
            }

            // Valida cada tarea antes de crear los objetos.
            datos.forEach((dato: any, indice: number) => {
                this.validarTarea(dato, indice);
            });

            // Convierte los datos validados en objetos Tarea.
            const tareas = datos.map((dato: any) => Tarea.desdeJSON(dato));

            return tareas;

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al cargar tasks.json: ${error.message}`);
            }

            throw error;
        }
    }

    guardarTareas(tareas: Tarea[]): void {
        try {
            // Convierte cada objeto Tarea al formato JSON requerido.
            const datos = tareas.map((tarea) => tarea.toJSON());

            // Escribe el contenido en el archivo original.
            fs.writeFileSync(
                this.rutaArchivo,
                JSON.stringify(datos, null, 2),
                "utf-8"
            );

        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error al guardar tasks.json: ${error.message}`);
            }

            throw error;
        }
    }
}
