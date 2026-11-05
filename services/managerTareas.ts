import { Tarea } from "../models/tarea";
import { RepositorioTareas } from "../persistence/repositorioTareas";

export class GestorTareas {
    private repositorio: RepositorioTareas;

    constructor(repositorio?: RepositorioTareas) {
        this.repositorio = repositorio ?? new RepositorioTareas();
    }

    cargarTareas(): Tarea[] {
        return this.repositorio.cargarTareas();
    }

    guardarTareas(tareas: Tarea[]): void {
        this.repositorio.guardarTareas(tareas);
    }

    agregarTarea(tarea: Tarea): void {
        const tareas = this.cargarTareas();

        tareas.push(tarea);

        this.guardarTareas(tareas);
    }

    buscarTareas(texto: string): Tarea[] {
        const normalizar = (valor: string): string =>
            valor
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        const busqueda = normalizar(texto.trim());

        if (busqueda === "") {
            return [];
        }

        return this.cargarTareas().filter((tarea) =>
            normalizar(tarea.titulo).includes(busqueda) ||
            normalizar(tarea.descripcion).includes(busqueda)
        );
    }

    filtrarPorEstado(estado: string): Tarea[] {
        return this.cargarTareas().filter(
            (tarea) => tarea.estado === estado
        );
    }
}

