export type EstadoTarea =
    | "Pendiente"
    | "En proceso"
    | "Finalizada";

export type DificultadTarea =
    | "Facil"
    | "Medio"
    | "Dificil";

export class Tarea {
    private _titulo: string;
    private _descripcion: string;
    private _estado: EstadoTarea;
    private _dificultad: DificultadTarea;
    private _fechaCreacion: string;
    private _fechaFinalizacion: string | null;

    constructor(
        titulo: string,
        descripcion: string,
        estado: EstadoTarea,
        dificultad: DificultadTarea,
        fechaCreacion: string,
        fechaFinalizacion: string | null = null
    ) {
        this._titulo = titulo;
        this._descripcion = descripcion;
        this._estado = estado;
        this._dificultad = dificultad;
        this._fechaCreacion = fechaCreacion;
        this._fechaFinalizacion = fechaFinalizacion;
    }

    get titulo(): string {
        return this._titulo;
    }

    get descripcion(): string {
        return this._descripcion;
    }

    get estado(): EstadoTarea {
        return this._estado;
    }

    get dificultad(): DificultadTarea {
        return this._dificultad;
    }

    get fechaCreacion(): string {
        return this._fechaCreacion;
    }

    get fechaFinalizacion(): string | null {
        return this._fechaFinalizacion;
    }

    actualizarTitulo(nuevoTitulo: string): void {
        if (nuevoTitulo.trim() === "") {
            throw new Error("El título no puede estar vacío.");
        }

        this._titulo = nuevoTitulo;
    }

    actualizarDescripcion(nuevaDescripcion: string): void {
        if (nuevaDescripcion.length > 200) {
            throw new Error(
                "La descripción no puede superar los 200 caracteres."
            );
        }

        this._descripcion = nuevaDescripcion;
    }

    actualizarEstado(nuevoEstado: EstadoTarea): void {
        this._estado = nuevoEstado;

        if (nuevoEstado === "Finalizada") {
            if (this._fechaFinalizacion === null) {
                this._fechaFinalizacion =
                    new Date().toISOString().split("T")[0]!;
            }
        } else {
            this._fechaFinalizacion = null;
        }
    }

    actualizarDificultad(
        nuevaDificultad: DificultadTarea
    ): void {
        this._dificultad = nuevaDificultad;
    }

    actualizarFechaFinalizacion(
        nuevaFecha: string | null
    ): void {
        this._fechaFinalizacion = nuevaFecha;
    }

    toJSON() {
        return {
            titulo: this._titulo,
            descripcion: this._descripcion,
            estado: this._estado,
            dificultad: this._dificultad,
            fechaCreacion: this._fechaCreacion,
            fechaFinalizacion: this._fechaFinalizacion
        };
    }

    static desdeJSON(datos: {
        titulo: string;
        descripcion: string;
        estado: EstadoTarea;
        dificultad: DificultadTarea;
        fechaCreacion: string;
        fechaFinalizacion: string | null;
    }): Tarea {
        return new Tarea(
            datos.titulo,
            datos.descripcion,
            datos.estado,
            datos.dificultad,
            datos.fechaCreacion,
            datos.fechaFinalizacion
        );
    }
}

