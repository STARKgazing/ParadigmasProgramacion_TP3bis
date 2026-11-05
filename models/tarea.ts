export type EstadoTarea =
    | "PENDING"
    | "IN-PROGRESS"
    | "FINISHED"
    | "CANCELED";

export type DificultadTarea = 1 | 2 | 3;

export class Tarea {
    private _titulo: string;
    private _descripcion: string | null;
    private _estado: EstadoTarea;
    private _creacion: string;
    private _ultimaEdicion: string | null;
    private _vencimiento: string | null;
    private _dificultad: DificultadTarea;

    constructor(
        titulo: string,
        descripcion: string | null,
        estado: EstadoTarea,
        creacion: string,
        ultimaEdicion: string | null,
        vencimiento: string | null,
        dificultad: DificultadTarea
    ) {
        this._titulo = titulo;
        this._descripcion = descripcion;
        this._estado = estado;
        this._creacion = creacion;
        this._ultimaEdicion = ultimaEdicion;
        this._vencimiento = vencimiento;
        this._dificultad = dificultad;
    }

    get titulo(): string {
        return this._titulo;
    }

    get descripcion(): string | null {
        return this._descripcion;
    }

    get estado(): EstadoTarea {
        return this._estado;
    }

    get creacion(): string {
        return this._creacion;
    }

    get ultimaEdicion(): string | null {
        return this._ultimaEdicion;
    }

    get vencimiento(): string | null {
        return this._vencimiento;
    }

    get dificultad(): DificultadTarea {
        return this._dificultad;
    }

    actualizarTitulo(nuevoTitulo: string): void {
        if (nuevoTitulo.trim() === "") {
            throw new Error("El título no puede estar vacío.");
        }
        this._titulo = nuevoTitulo;
    }

    actualizarDescripcion(nuevaDescripcion: string | null): void {
        this._descripcion = nuevaDescripcion;
    }

    actualizarEstado(nuevoEstado: EstadoTarea): void {
        this._estado = nuevoEstado;
    }

    actualizarCreacion(nuevaFecha: string): void {
        this._creacion = nuevaFecha;
    }

    actualizarUltimaEdicion(nuevaFecha: string | null): void {
        this._ultimaEdicion = nuevaFecha;
    }

    actualizarVencimiento(nuevaFecha: string | null): void {
        this._vencimiento = nuevaFecha;
    }

    actualizarDificultad(nuevaDificultad: DificultadTarea): void {
        this._dificultad = nuevaDificultad;
    }

    toJSON() {
        return {
            titulo: this._titulo,
            descripcion: this._descripcion,
            estado: this._estado,
            creacion: this._creacion,
            ultimaEdicion: this._ultimaEdicion,
            vencimiento: this._vencimiento,
            dificultad: this._dificultad
        };
    }

    static desdeJSON(datos: {
        titulo: string;
        descripcion: string | null;
        estado: EstadoTarea;
        creacion: string;
        ultimaEdicion: string | null;
        vencimiento: string | null;
        dificultad: DificultadTarea;
    }): Tarea {
        return new Tarea(
            datos.titulo,
            datos.descripcion,
            datos.estado,
            datos.creacion,
            datos.ultimaEdicion,
            datos.vencimiento,
            datos.dificultad
        );
    }
}
