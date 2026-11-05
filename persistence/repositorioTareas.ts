
import * as fs from "fs";
import * as path from "path";
import { Tarea } from "../models/tarea";

export class RepositorioTareas {
    private rutaArchivo: string;

    constructor() {
        this.rutaArchivo = path.join(__dirname, "../tareas.json");
    }

    cargarTareas(): Tarea[] {
        const contenido = fs.readFileSync(this.rutaArchivo, "utf-8");
        const datos = JSON.parse(contenido);

        return datos.map((dato: any) => Tarea.desdeJSON(dato));
    }

    guardarTareas(tareas: Tarea[]): void {
        const datos = tareas.map((tarea) => tarea.toJSON());

        fs.writeFileSync(
            this.rutaArchivo,
            JSON.stringify(datos, null, 2),
            "utf-8"
        );
    }
}

