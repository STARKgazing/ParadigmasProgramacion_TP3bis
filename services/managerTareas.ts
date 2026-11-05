import { Tarea } from "../models/tarea";
import { RepositorioTareas } from "../persistence/repositorioTareas";

export class GestorTareas {
    private repositorio: RepositorioTareas;
    private tareas: Tarea[];

    constructor(repositorio?: RepositorioTareas) {
        this.repositorio = repositorio ?? new RepositorioTareas();

        // Carga las tareas una sola vez al iniciar el gestor.
        this.tareas = this.repositorio.cargarTareas();

        // Muestra un resumen de la carga inicial.
        console.log(`Se cargaron ${this.tareas.length} tareas correctamente.`);
    }

    cargarTareas(): Tarea[] {
        return this.tareas;
    }

    guardarTareas(): void {
        // Guarda la lista actual en el archivo JSON original.
        this.repositorio.guardarTareas(this.tareas);
    }

    agregarTarea(tarea: Tarea): void {
        this.tareas.push(tarea);
        this.guardarTareas();
    }

    buscarTareas(texto: string): Tarea[] {
        const normalizar = (valor: string): string =>
            valor.toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        const busqueda = normalizar(texto.trim());

        if (busqueda === "") {
            return [];
        }

        return this.tareas.filter((tarea) =>
            normalizar(tarea.titulo).includes(busqueda) ||
            normalizar(tarea.descripcion ?? "").includes(busqueda)
        );
    }

    filtrarPorEstado(estado: string): Tarea[] {
        return this.tareas.filter((tarea) => tarea.estado === estado);
    }

    editarTarea(indice: number, tareaActualizada: Tarea): void {
        if (indice < 0 || indice >= this.tareas.length) {
            throw new Error("El índice de la tarea no es válido.");
        }

        this.tareas[indice] = tareaActualizada;
        this.guardarTareas();
    }
}
